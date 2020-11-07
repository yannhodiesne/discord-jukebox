const { atomicRun } = require('../atomic');

const { getQueue, setQueue, deleteQueue } = require('../queue');
const { shuffle } = require('../utils/shuffle');
const { message, error } = require('../utils/message');
const presence = require('../presence');
const { songinfo } = require('../utils/songinfo');
const { sources } = require('../sources');

exports.help = "Ajoute le morceau ou la playlist demandée à la fin de la liste de lecture";

exports.run = async (msg, serverQueue, top = false, shuffleSongs = false) => {
    const arg = msg.content.substring(msg.content.indexOf(' ') + 1).trim()
    const args = arg.split(' ');

    const voiceChannel = msg.member.voice.channel;

    if (!voiceChannel)
        return msg.channel.send(error('Vous devez être connecté dans un salon vocal pour utiliser cette commande'));

    const permissions = voiceChannel.permissionsFor(msg.client.user);

    if (!permissions.has('CONNECT') || !permissions.has('SPEAK'))
        return msg.channel.send(error('Je n\'ai pas le droit de me connecter ou de parler dans ce salon vocal :cry:'));

    if (args.length === 0)
        return msg.channel.send(error('Veuillez vous mettre un doigt dans le cul puis souffler sur une oie afin d\'exorciser le lorrain qui est en vous.'));

    let songs = [];

    // Lecture de liens multiples
    // Ajout des musiques des différentes sources (hors sources de recherche par mot-clé)
    for (let i = 0; i < args.length; i++) {
        const a = args[i];
        
        if (a !== '')
            songs.push(...await fetchSongs(a, msg.author.username, false));
    }

    // Si aucune musique n'est trouvée
    if (songs.length === 0)
        // Ajout des musiques de la première source de recherche qui a un résultat
        songs.push(...await fetchSongs(arg, msg.author.username, true));

    // Si aucune musique n'a été trouvée malgré tout
    if (songs.length === 0)
        return msg.channel.send(error('Aucune musique n\'a été trouvée'));

    if (shuffleSongs)
        shuffle(songs);

    if (!serverQueue) {
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            dispatcher: null,
            stream: null,
            songs: [],
            volume: 20,
            playing: true,
        };

        queueConstruct.songs.push(...songs);

        await setQueue(msg.guild.id, queueConstruct);

        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;

            if (songs.length === 1)
                msg.channel.send(message('arrow_forward', `Lancement de la lecture avec ${songinfo(songs[0])}`));
            else
                msg.channel.send(message('arrow_forward', `Lancement de la lecture avec **${songs.length} morceaux**`));
            
            await streamSong(msg.client, msg.guild, queueConstruct.songs[0]);
            return true;
        } catch (err) {
            console.log(err);
            await deleteQueue(msg.guild.id);
            return msg.channel.send(error(`Une erreur inattendue est survenue : ${err}`));
        }
    } else {
        let res;

        if (top) {
            await atomicRun(msg.guild.id, () => serverQueue.songs.splice(1, 0, ...songs));

            if (songs.length === 1)
                res = message('white_check_mark', `${songinfo(songs[0])} a été ajouté au début de la liste de lecture`);
            else
                res = message('white_check_mark', `**${songs.length} morceaux** ont été ajoutés au début de la liste de lecture`);
        } else {
            await atomicRun(msg.guild.id, () => serverQueue.songs.push(...songs));

            if (songs.length === 1)
                res = message('white_check_mark', `${songinfo(songs[0])} a été ajouté à la liste de lecture`);
            else
                res = message('white_check_mark', `**${songs.length} morceaux** ont été ajoutés à la liste de lecture`);
        }

        msg.channel.send(res);
        return true;
    }
};

const fetchSongs = async (input, user, search) => {
    // Sélection de la source appropriée et récupération du/des morceaux
    const validSources = sources.filter(s => s.isSearch === search && s.isValidInput(input));

    if (validSources.length === 0)
        return [];

    let res = null;
    let source = null;

    for (let i = 0; i < validSources.length && res === null; i++) {
        res = await validSources[i].getSongs(input);
        source = validSources[i];
    }

    // Si aucune musique n'a été trouvée
    if (res === null)
        return [];

    // Ajout des propriétés manquantes
    res.forEach(s => {
        s.source = source;
        s.user = user;
    });

    return res;
};

const streamSong = async (client, guild, song) => {
    const serverQueue = await getQueue(guild.id);

    // Si il n'y a pas de musique à jouer
    if (!song) {
        presence.reset(client);
        serverQueue.voiceChannel.leave();
        await deleteQueue(guild.id);
        return;
    }

    // Passe à la musique suivante
    const shift = async () => await atomicRun(guild.id, () => {
        serverQueue.songs.shift();
        streamSong(client, guild, serverQueue.songs[0]);
    });

    // Ferme le flux de la musique précédente
    if (serverQueue.stream)
        serverQueue.stream.destroy();

    // Récupération du flux audio
    let stream;
    let tryCount = 0;

    while (stream === undefined && tryCount < 5) {
        try {
            stream = await song.source.getStream(song);

            if (!stream)
                throw new Error('Impossible d\'obtenir le flux, la source n\'a rien renvoyé');
        } catch (e) {
            if (tryCount !== 4) {
                tryCount++;
                console.log(`Error encountered, trying again (${tryCount})...`);
            } else {
                console.log(e);
                serverQueue.textChannel.send(error(`Impossible de lire la musique : ${e}`));
                shift();
                return;
            }
        }
    }

    serverQueue.stream = stream;
    
    // Gestion d'erreur du stream entrant
    serverQueue.stream.on('error', e => {
        console.log(e);
        serverQueue.textChannel.send(error(`Une erreur est survenue pendant la communication avec Discord : ${e}`));
        shift();
    });

    // Lecture du flux dans le salon vocal
    serverQueue.dispatcher = serverQueue.connection
        .play(serverQueue.stream, song.source.streamOptions)
        .on('finish', shift)
        .on('error', err => {
            console.log(err);
            serverQueue.textChannel.send(error(`Impossible de jouer ${songinfo(song)} : ${err}`));
            shift();
        });

    serverQueue.dispatcher.setVolumeLogarithmic(serverQueue.volume / 20);

    // Mise à jour du statut Discord
    presence.listening(client, song.title);

    // Message informatif
    let res = message('next_track', `En lecture : ${songinfo(song)}`);
    res += message('small_blue_diamond', `Suivant : ${serverQueue.songs.length > 1 ? songinfo(serverQueue.songs[1]) : '*fin de la liste de lecture*'}`);

    serverQueue.textChannel.send(res);
};

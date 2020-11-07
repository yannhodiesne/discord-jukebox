const { atomicRun } = require('../atomic');

const { message, error } = require('../utils/message');
const { songinfo } = require('../utils/songinfo');

exports.help = "Joue une deuxième fois la musique en cours de lecture";

exports.run = (msg, serverQueue) => {
    if (!msg.member.voice.channel)
        return msg.channel.send(error('Vous devez être connecté dans un salon vocal pour utiliser cette commande'));

    if (!serverQueue || serverQueue.songs.length === 0)
        return msg.channel.send(error('Il n\'y a pas de musique à passer'));

    atomicRun(msg.guild.id, () => serverQueue.songs.unshift(serverQueue.songs[0]));

    return msg.channel.send(message('repeat', `${songinfo(serverQueue.songs[0])} sera rejouée à la fin du morceau en cours`));
};

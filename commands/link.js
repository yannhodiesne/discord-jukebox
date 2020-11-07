const { atomicRun } = require('../atomic');

const { message, error } = require('../utils/message');
const { songinfo } = require('../utils/songinfo');

exports.help = "Envoie le lien vers la musique en cours de lecture par message privé";

exports.run = async (msg, serverQueue) => {
    if (!serverQueue || serverQueue.songs.length === 0)
        return msg.channel.send(error('Il n\'y a pas de lecture en cours'));

    const song = await atomicRun(msg.guild.id, () => serverQueue.songs[0]);

    let mp = message('notes', songinfo(song));
    mp += message('hash', song.url);

    try {
        await msg.author.send(mp);
    } catch (e) {
        return msg.channel.send(error('Impossible de vous envoyer un message privé'));
    }

    return msg.channel.send(message('speech_balloon', 'Le lien vers la musique en cours vous a été envoyé par message privé'));
};

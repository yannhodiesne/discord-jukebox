const { atomicRun } = require('../atomic');

const { line, message, error } = require('../utils/message');
const { songinfo } = require('../utils/songinfo');

const { prefix } = require('../config.json');

exports.help = "Affiche la musique en cours de lecture et le temps écoulé";

exports.run = async (msg, serverQueue) => {
    if (!serverQueue || serverQueue.songs.length === 0)
        return msg.channel.send(error('Il n\'y a pas de lecture en cours'));

    const song = await atomicRun(msg.guild.id, () => serverQueue.songs[0]);
    const time = Math.floor(serverQueue.dispatcher.streamTime / 1000);

    let res = message('notes', songinfo(song));
    res += message('clock9', `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, "0")} / ${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, "0")} (*${Math.floor((100 * time) / song.duration)}%*)`);
    res += message('link', song.url);
    res += line(`*Utilisez \`${prefix}link\` pour obtenir le lien vers la musique en cours par message privé*`);

    const sent = await msg.channel.send(res);
    sent.suppressEmbeds(true);
    return;
};

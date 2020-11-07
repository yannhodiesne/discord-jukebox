const { atomicRun } = require('../atomic');

const { line, message, error } = require('../utils/message');
const { songinfo } = require('../utils/songinfo');

exports.help = "Affiche la liste de lecture";

exports.run = async (msg, serverQueue) => {
    let list;
    
    await atomicRun(msg.guild.id, () => {
        if (!serverQueue || serverQueue.songs.length === 0)
            return msg.channel.send(error('Il n\'y a pas de liste de lecture en cours'));

        list = line(`**${serverQueue.songs.length} morceau${serverQueue.songs.length > 1 ? 'x' : ''}**`) + line('');
        list += message('notes', `1. ${songinfo(serverQueue.songs[0])}`);

        for (let i = 1; i < 10 && i < serverQueue.songs.length; i++) {
            list += line(`${i + 1}. ${songinfo(serverQueue.songs[i])}`);
        }
    });

    return msg.channel.send(list);
};

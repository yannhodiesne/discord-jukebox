const { atomicRun } = require('../atomic');

const { shuffle } = require('../utils/shuffle');
const { message, error } = require('../utils/message');

exports.help = "Mélange la liste de lecture";

exports.run = async (msg, serverQueue) => {
    if (!msg.member.voice.channel)
        return msg.channel.send(error('Vous devez être connecté dans un salon vocal pour utiliser cette commande'));

    if (!serverQueue || serverQueue.songs.length === 0)
        return msg.channel.send(error('Il n\'y a pas de liste de lecture en cours'));

    await atomicRun(msg.guild.id, () => {
        const current = serverQueue.songs.shift();
        shuffle(serverQueue.songs);
        serverQueue.songs.unshift(current);
    });

    return msg.channel.send(message('twisted_rightwards_arrows', 'Liste de lecture mélangée !'));
};

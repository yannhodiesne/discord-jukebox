const { atomicRun } = require('../atomic');
const { error } = require('../utils/message');

exports.help = "Passe le morceau en cours";

exports.run = (msg, serverQueue) => {
    if (!msg.member.voice.channel)
        return msg.channel.send(error('Vous devez être connecté dans un salon vocal pour utiliser cette commande'));

    if (!serverQueue)
        return msg.channel.send(error('Il n\'y a pas de musique à passer'));

    atomicRun(msg.guild.id, () => serverQueue.connection.dispatcher.end());
};

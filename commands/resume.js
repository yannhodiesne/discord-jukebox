const { message, error } = require('../utils/message');

exports.help = "Reprend la lecture mise en pause";

exports.run = (msg, serverQueue) => {
    if (!msg.member.voice.channel)
        return msg.channel.send(error('Vous devez être connecté dans un salon vocal pour utiliser cette commande'));

    if (!serverQueue)
        return msg.channel.send(error('Il n\'y a pas de liste de lecture en cours'));

    if (serverQueue.playing)
        return msg.channel.send(error('La lecture n\'est pas en pause'));

    serverQueue.playing = true;
    serverQueue.dispatcher.resume();
    return msg.channel.send(message('arrow_forward', 'Reprise de la lecture'));
};

const { message, error } = require('../utils/message');

exports.help = "Met la lecture en cours en pause";

exports.run = (msg, serverQueue) => {
    if (!msg.member.voice.channel)
        return msg.channel.send(error('Vous devez être connecté dans un salon vocal pour utiliser cette commande'));

    if (!serverQueue)
        return msg.channel.send(error('Il n\'y a pas de lecture en cours'));

    if (!serverQueue.playing)
        return msg.channel.send(error('La lecture est déjà en pause'));

    serverQueue.playing = false;
    serverQueue.dispatcher.pause();
    return msg.channel.send(message('pause_button', 'Lecture en pause'));
}

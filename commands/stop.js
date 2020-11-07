const { message, error } = require('../utils/message');

exports.help = "Arrête la lecture et vide la liste de lecture";

exports.run = (msg, serverQueue) => {
    if (!msg.member.voice.channel)
        return msg.channel.send(error('Vous devez être connecté dans un salon vocal pour utiliser cette commande'));
    
    serverQueue.songs = [];

    if (serverQueue.connection.dispatcher) {
        serverQueue.connection.dispatcher.end();
    }

    msg.channel.send(message('stop_button', 'Arrêt de la musique et remise à zéro de la liste de lecture'));
};

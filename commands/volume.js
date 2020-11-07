const { message, info, error } = require('../utils/message');
const { prefix } = require('../config.json');

exports.help = "Règle le volume de la musique";

exports.run = (msg, serverQueue) => {
    if (!msg.member.voice.channel)
        return msg.channel.send(error('Vous devez être connecté dans un salon vocal pour utiliser cette commande'));

    if (!serverQueue)
        return msg.channel.send(error('Il n\'y a pas de liste de lecture en cours'));

    let args = msg.content.split(' ');

    if (args.length < 2)
        return msg.channel.send(info(`Utilisation: \`${prefix}volume 1-20\` où 20 est le volume maximum`));

    let vol = parseInt(args[1]);

    if (isNaN(vol) || vol < 1 || vol > 20)
        return msg.channel.send(error('Le volume doit être compris entre 1 et 20'));

    serverQueue.volume = vol;
    serverQueue.dispatcher.setVolumeLogarithmic(vol / 20);

    return msg.channel.send(message('signal_strength', `Le volume est maintenant à **${vol * 5}%**`));
};

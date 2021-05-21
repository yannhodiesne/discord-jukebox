const { message } = require('../utils/message');

exports.help = "Provoque un redémarrage du bot";

exports.run = (msg) => {
    msg.channel.send(message('skull', 'Redémarrage du bot...'));

    setTimeout(() => process.exit(1), 2000);
}

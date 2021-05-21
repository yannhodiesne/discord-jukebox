const play = require('./play');
const playtop = require('./playtop');
const replay = require('./replay');
const skip = require('./skip');
const stop = require('./stop');
const pause = require('./pause');
const resume = require('./resume');
const volume = require('./volume');
const queue = require('./queue');
const nowPlaying = require('./nowplaying');
const shuffle = require('./shuffle');
const link = require('./link');
const playshuffle = require('./playshuffle');
const restart = require('./restart');

// Commande help
const { message, line, info } = require('../utils/message');
const { prefix } = require('../config.json');

const help = {
    help: 'Affiche la liste des commandes disponibles',
    run: async (msg) => {
        let res = info('Liste des commandes');

        Object.keys(exports.commands).forEach(e => res += line(`- \`${prefix}${e}\` : ${exports.commands[e].help}`));

        res += message('open_file_folder', 'https://github.com/yannhodiesne/discord-jukebox');

        const sent = await msg.channel.send(res);
        sent.suppressEmbeds(true);
        return;
    }
};

// Liste des commandes disponibles
exports.commands = {
    help: help,
    play: play,
    playtop: playtop,
    volume: volume,
    pause: pause,
    resume: resume,
    skip: skip,
    next: skip,
    replay: replay,
    stop: stop,
    queue: queue,
    np: nowPlaying,
    link: link,
    shuffle: shuffle,
    playshuffle: playshuffle,
    restart: restart,
};

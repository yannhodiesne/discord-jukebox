const play = require('./play').run;

exports.help = "Ajoute le morceau ou la playlist demandée puis mélange la liste de lecture";

exports.run = async (msg, serverQueue) => await play(msg, serverQueue, false, true);

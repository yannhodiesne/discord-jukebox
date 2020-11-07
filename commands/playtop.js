const play = require('./play').run;

exports.help = "Ajoute le morceau ou la playlist demandée au début de la liste de lecture";

exports.run = async (msg, serverQueue) => await play(msg, serverQueue, true);

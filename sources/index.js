const ytPlaylist = require('./ytPlaylist');
const ytVideo = require('./ytVideo');
const ytSearch = require('./ytSearch');

// Liste des sources disponibles, dans leur ordre de priorité
exports.sources = [
    ytPlaylist,
    ytVideo,
    ytSearch
];

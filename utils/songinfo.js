const songinfo = (song) => `**${song.title}** (${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, "0")}) - *${song.user}*`;

module.exports = {
    songinfo
};

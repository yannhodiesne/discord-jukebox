const ytdl = require('discord-ytdl-core');
const ytpl = require('ytpl');

const Song = require('../models/song');

exports.name = "ytPlaylist";

exports.isValidInput = input => ytpl.validateID(input);

exports.isSearch = false;

exports.getSongs = async input => {
    try {
        const playlist = await ytpl(input, { limit: Infinity });

        return playlist.items.filter(e => e.duration !== null).map(e => new Song(
            e.title,
            e.url,
            (parseInt(e.duration.split(':')[0]) * 60) + parseInt(e.duration.split(':')[1]),
            e.author.name
        ));
    } catch (e) {
        console.log(e);
        return null;
    }
};

exports.getStream = async song => await ytdl(song.url, { opusEncoded: true, quality: 'highestaudio', highWaterMark: 1<<25 });

exports.streamOptions = { type: 'opus' };

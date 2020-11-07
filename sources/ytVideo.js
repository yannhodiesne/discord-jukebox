const ytdl = require('ytdl-core-discord');

const Song = require('../models/song');

exports.name = "ytVideo";

exports.isValidInput = input => ytdl.validateURL(input);

exports.isSearch = false;

exports.getSongs = async input => {
    const songs = [];

    try {
        const songInfo = await ytdl.getBasicInfo(input);
        songs.push(new Song(songInfo.videoDetails.title, songInfo.videoDetails.video_url, songInfo.videoDetails.lengthSeconds, songInfo.videoDetails.author.name));
    } catch (e) {
        console.log(e);
        return null;
    }

    return songs;
};

exports.getStream = async song => await ytdl(song.url, { quality: 'highestaudio', highWaterMark: 1<<25 });

exports.streamOptions = { type: 'opus' };

const ytdl = require('discord-ytdl-core');
const ytsr = require('yt-search');

const Song = require('../models/song');

const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

exports.name = "ytSearch";

// Si c'est un URL, ne gère pas la requête
exports.isValidInput = input => input.match(regex) !== null ? false : true;

exports.isSearch = true;

exports.getSongs = async input => {
    const songs = [];

    try {
        const response = await ytsr(input);
        const videos = response.videos;

        if (videos.length === 0)
            return null;

        const song = videos[0];

        songs.push(new Song(
            song.title,
            song.url,
            (parseInt(song.timestamp.split(':')[0]) * 60) + parseInt(song.timestamp.split(':')[1]),
            song.author.name
        ));
    } catch (e) {
        console.log(e);
        return null;
    }

    return songs;
};

exports.getStream = async song => await ytdl(song.url, { opusEncoded: true, quality: 'highestaudio', highWaterMark: 1<<25 });

exports.streamOptions = { type: 'opus' };

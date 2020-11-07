class Song {
    constructor(title, url, duration, author) {
        if (!title)
            throw new Error('title est requis');

        if (!url)
            throw new Error('url est requis');

        if (!duration)
            throw new Error('duration est requis');

        if (!author)
            throw new Error('author est requis');

        this.title = title;
        this.url = url;
        this.duration = duration;
        this.author = author;
    }
}

module.exports = Song;

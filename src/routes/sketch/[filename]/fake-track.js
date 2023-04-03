export const fakeTrack = (
    {
        slug = 'sketch',
        sketchpath = `/src/routes/sketch/${ slug }.js`,
        audioUrl = 'https://res.cloudinary.com/multimonos/video/upload/v1618331761/audio/animals/bbc_western-di_nhu0510004.mp3',
        duration = false,
        params = {}
    }
) => ({
    _key: "7222867ffc3c",
    _type: "track",
    name: slug,
    album: {
        _id: `${ slug }-fake-id`,
        _type: "album",
        album_type: "single",
        links: {
            href: `http://localhost:5173/albums/${ slug }`,
            self: `http://localhost:5173/api/albums/${ slug }-fake-id`,
            share: `http://localhost:5173/share/multimonos:album:${ slug }-fake-id`
        },
        name: "sketching",
        poster: "/1.png",
        slug: `${ slug }`
    },
    links: {
        self: `http://localhost:5173/api/albums/${ slug }-fake-id/tracks/7222867ffc3c`,
        share: `http://localhost:5173/share/multimonos:track:${ slug }-fake-id:7222867ffc3c`
    },
    media: {
        _type: "media",
        media_type: "p5js",
        audioUrl,
        duration,
        params,
        url: sketchpath
    },
})
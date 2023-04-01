export const fakeTrack = (
    {
        name = 'sketch',
        sketchpath = '/src/routes/sketch/sketch.js',
        duration = false,
        params = {
            audioUrl: "https://res.cloudinary.com/multimonos/video/upload/v1618331761/audio/animals/bbc_western-di_nhu0510004.mp3",
        }
    }
) => ({
    "_key": "7222867ffc3c",
    "_type": "track",
    "album": {
        "_id": "42348b4d-7f49-4888-acd1-562e69ae093e",
        "_type": "album",
        "album_type": "single",
        "links": {
            "href": "http://localhost:5173/albums/sketching",
            "self": "http://localhost:5173/api/albums/42348b4d-7f49-4888-acd1-562e69ae093e",
            "share": "http://localhost:5173/share/multimonos:album:42348b4d-7f49-4888-acd1-562e69ae093e"
        },
        "name": "Sketching",
        "poster": "/1.png",
        "slug": "sketch"
    },
    duration,
    "links": {
        "self": "http://localhost:5173/api/albums/42348b4d-7f49-4888-acd1-562e69ae093e/tracks/7222867ffc3c",
        "share": "http://localhost:5173/share/multimonos:track:42348b4d-7f49-4888-acd1-562e69ae093e:7222867ffc3c"
    },
    "media": {
        "_type": "media",
        "media_type": "p5js",
        params,
        "url": sketchpath
    },
    "name": name,
})
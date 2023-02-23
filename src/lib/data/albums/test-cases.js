export const album = {
    id: "test-cases-happy-path",
    album_type: "compilation",
    name: "Happy Path Test Cases",
    bg_color: null,
    images: [],
    artists: [ 'multimonos' ],
    tracks: [
        { id: 'image1', name: '🧪 image 1', duration: 2000, media: { media_type: 'image', url: `/1.png` } },
        { id: 'image2', name: '🧪 image 2', duration: 2000, media: { media_type: 'image', url: `/2.png` } },
        { id: 'image3', name: '🧪 image 3', duration: 2000, media: { media_type: 'image', url: `/3.png` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/red.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/blue.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/green.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/prepare-async.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/prepare-async-error.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/import-scripts.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/custom-methods.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/audio-osc.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/audio-mic.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/audio-url.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/prepare-params.bundle.js`, params: { index: 2 } } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/querystring.bundle.js?foo=bar&bam=bash` } },
        {
            media: {
                media_type: 'p5js',
                url: `PUBLIC_MEDIA_URL/test/p5js/querystring-audio.bundle.js?audioUrl=https%3A%2F%2Fres.cloudinary.com%2Fmultimonos%2Fvideo%2Fupload%2Fv1612053124%2Faudio%2Fanimals%2Fcat.mp3`
            }
        },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/sketch/coldwave-moonrise/audio.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/infinite-play.bundle.js` } },
    ]
}


//    fakeTrack( { id: 'unknownMedia', name: '🧪⚠️ unknown media', duration: 2000, media: { type: 'foobar/bam', url: '' } } ),

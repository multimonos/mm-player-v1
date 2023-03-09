export const album = {
    slug: "test-cases-happy-path",
    album_type: "compilation",
    name: "Happy Path Test Cases",
    bg_color: null,
    images: [],
   artists: [ 'multimonos' ],
    tracks: [
        { slug: 'image1', name: 'Image #1 Test', duration: 2000, media: { media_type: 'image', url: `/1.png` } },
        { slug: 'image2', name: 'Image #2 Test', duration: 2000, media: { media_type: 'image', url: `/2.png` } },
        { slug: 'image3', name: 'Image #3 Test', duration: 2000, media: { media_type: 'image', url: `/3.png` } },
        // { id: 'image5min', name: '🧪 image 5 mins', duration: 5*60*1000, media: { media_type: 'image', url: `/3.png` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/red.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/blue.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/green.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/prepare-async.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/prepare-async-error.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/audio-osc.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/audio-mic.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/audio-random-cloudinary.bundle.js` } },
        {
            media: {
                media_type: 'p5js',
                url: `PUBLIC_MEDIA_URL/test/querystring-audio.bundle.js?audioUrl=https%3A%2F%2Fres.cloudinary.com%2Fmultimonos%2Fvideo%2Fupload%2Fv1612053124%2Faudio%2Fanimals%2Fcat.mp3`
            }
        },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/prepare-params.bundle.js`, params: { index: 2 } } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/import-scripts.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/custom-methods.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/querystring.bundle.js?foo=bar&bam=bash` } },

        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/super-wide.bundle.js` } },
        { media: { media_type: 'p5js', url: `PUBLIC_MEDIA_URL/test/infinite-play.bundle.js` } },
    ]
}


//    fakeTrack( { id: 'unknownMedia', name: '🧪⚠️ unknown media', duration: 2000, media: { type: 'foobar/bam', url: '' } } ),

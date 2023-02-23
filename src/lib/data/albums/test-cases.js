import { v4 as uuidv4 } from "uuid"


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


export const fakeTrack = (
    {
        id = uuidv4().split( '-' )[0],
        name,
        duration = 2000,
        media = null
    } ) => (
    {
        id,
        name,
        duration,
        media,
    })


export const testCases = [
    // images
    fakeTrack( { id: 'image1', name: '🧪 image 1', duration: 2000, media: { type: 'image', url: `/1.png` } } ),
    fakeTrack( { id: 'image2', name: '🧪 image 2', duration: 2000, media: { type: 'image', url: `/2.png` } } ),
    fakeTrack( { id: 'image3', name: '🧪 image 3', duration: 2000, media: { type: 'image', url: `/3.png` } } ),
    // p5js basic
    fakeTrack( { id: 'p5jsRed', name: '🧪 red p5js', duration: 2000, media: { type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/red.bundle.js` } } ),
    fakeTrack( {
        id: 'p5jsGreen',
        name: '🧪 green p5js',
        duration: 2000,
        media: { type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/green.bundle.js` }
    } ),
    fakeTrack( { id: 'p5jsBlue', name: '🧪 blue p5js', duration: 2000, media: { type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/blue.bundle.js` } } ),
    // prepare
    fakeTrack( {
        id: 'prepareAsync',
        name: '🧪 prepare ... async',
        duration: 3000,
        media: { type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/prepare-async.bundle.js` }
    } ),
    fakeTrack( {
        id: 'prepareAsyncErr',
        name: '🧪⚠️ prepare ... async error',
        duration: 3000,
        media: { type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/prepare-async-error.bundle.js` }
    } ),
    // imports
    fakeTrack( {
        id: 'importScripts',
        name: '🧪 import scripts test',
        duration: 3000,
        media: { type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/import-scripts.bundle.js` }
    } ),
    fakeTrack( {
        id: 'customMethods',
        name: '🧪 custom methods',
        duration: 10000,
        media: { type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/custom-methods.bundle.js` }
    } ),
    // audio
    fakeTrack( {
        id: 'audioOsc',
        name: '🧪 audio oscillator',
        duration: 3000,
        media: { type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/audio-osc.bundle.js` }
    } ),
    fakeTrack( {
        id: 'audioMic',
        name: '🧪 audio microphone',
        duration: 6000,
        media: { type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/audio-mic.bundle.js` }
    } ),
    fakeTrack( {
        id: 'audioUrl',
        name: '🧪 audio url',
        duration: 6000,
        media: { type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/audio-url.bundle.js` }
    } ),
    // params
    fakeTrack( {
        id: 'prepareParams',
        name: '🧪 params via prepare( { params } ) - dolphin',
        duration: 3000,
        media: { type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/prepare-params.bundle.js`, params: { index: 2 } }
    } ),
    fakeTrack( {
        id: 'paramsQuerystring',
        name: '🧪 params via import.meta.url querystring',
        duration: 3000,
        media: { type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/querystring.bundle.js?foo=bar&bam=bash` }
    } ),
    fakeTrack( {
        id: 'audioQuerystring',
        name: '🧪 audio via import.meta.url?audioUrl=',
        duration: 3000,
        media: {
            type: 'p5js',
            url: `PUBLIC_MEDIA_URL/test/p5js/querystring-audio.bundle.js?audioUrl=https%3A%2F%2Fres.cloudinary.com%2Fmultimonos%2Fvideo%2Fupload%2Fv1612053124%2Faudio%2Fanimals%2Fcat.mp3`
        }
    } ),
    // other cases
    fakeTrack( {
        id: 'coldwaveMoonrise',
        name: '🌚 coldwave moonrise 🌚',
        duration: 8000,
        media: { type: 'p5js', url: `PUBLIC_MEDIA_URL/sketch/coldwave-moonrise/audio.bundle.js` }
    } ),
    fakeTrack( {
        id: 'inifinitePlay',
        name: '🧪 infinite play',
        duration: false,
        media: { type: 'p5js', url: `PUBLIC_MEDIA_URL/test/p5js/infinite-play.bundle.js` }
    } ),
    fakeTrack( { id: 'unknownMedia', name: '🧪⚠️ unknown media', duration: 2000, media: { type: 'foobar/bam', url: '' } } ),
]

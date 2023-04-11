import { fakeTrack } from "./fake-track.js"


const DEFAULT_DURATION = 16000

const getAudioResources = async promise => {
    const res = await promise
    if ( ! res.ok ) return []
    return await res.json()
}

const getSketch = async path => {
    const module = await import(path/* @vite-ignore*/)
    const sketch = module.sketch
    return sketch
}

export const load = async ( { fetch, url, params } ) => {
    const sketchpath = `/src/routes/sketch/sketches/${ params.filename }.js`

    // custom audioUrl
    const audioUrl = url.searchParams.has( "audioUrl" )
        ? url.searchParams.get( "audioUrl" )
        : "https://res.cloudinary.com/multimonos/video/upload/v1618331073/audio/animals/bbc_giant-toad_nhu0501904.mp3"

    // custom duration - seconds
    const duration = url.searchParams.has( "du" )
        ? url.searchParams.get( "du" ) * 1000
        : DEFAULT_DURATION

    // fake a track
    const track = fakeTrack( {
        slug: params.filename,
        sketchpath,
        duration,
        audioUrl,
        params: {}
    } )

    // audio resource list
    const resources = await getAudioResources( fetch( 'https://mm-media.netlify.app/.netlify/functions/audio' ) )
    const audioResources = resources
        .sort( ( a, b ) => a.title < b.title ? -1 : 1 )
        .map( r => ({ ...r, "selected": r.url == audioUrl }) )

    // data
    const data = {
        track,
        audioResources,
        slug: params.filename,
        log: url.searchParams.has( 'log' )
    }

    // logging
    if ( url.searchParams.has( 'log' ) ) {
        console.log( 'sketch.data', JSON.stringify( data, null, 2 ) )
        console.log( 'sketch.track', JSON.stringify( track, null, 2 ) )
    }

    return data
}
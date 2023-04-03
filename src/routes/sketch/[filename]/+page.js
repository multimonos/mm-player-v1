import { fakeTrack } from "./fake-track.js"


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
    const sketchpath = `/src/routes/sketch/${ params.filename }.js`

    // custom audioUrl
    const audioUrl = url.searchParams.has( "audioUrl" )
        ? url.searchParams.get( "audioUrl" )
        : "https://res.cloudinary.com/multimonos/video/upload/v1618331073/audio/animals/bbc_giant-toad_nhu0501904.mp3"

    // custom duration - seconds
    const duration = url.searchParams.has( "du" )
        ? url.searchParams.get( "du" ) * 1000
        : false

    // audio resource list
    const resources = await getAudioResources( fetch( 'https://mm-media.netlify.app/.netlify/functions/audio' ) )
    const audioResources = resources.map( r => ({ ...r, "selected": r.url == audioUrl }) )

    // fake a track
    const track = fakeTrack( {
        slug: params.filename,
        sketchpath,
        duration,
        audioUrl,
        params: {}
    } )

    console.log( JSON.stringify( track, null, 2 ) )

    return {
        track,
        audioUrl,
        audioResources,
        sketchpath,
        slug: params.filename
    }
}
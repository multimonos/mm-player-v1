import {rollupForceViteReload} from "./force-vite-reload.js"
import { fakeTrack } from "./fake-track.js"
import { PUBLIC_MEDIA_API_URL } from "$env/static/public"

const DEFAULT_DURATION = false//16000

console.log({rollupForceViteReload})

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
    const sketchpath = `${PUBLIC_MEDIA_API_URL}${params.id}.bundle.js`
    console.log({sketchpath})

    // custom audioUrl
    const audioUrl = url.searchParams.has( "audioUrl" )
        ? url.searchParams.get( "audioUrl" )
        : "https://res.cloudinary.com/multimonos/video/upload/v1618331073/audio/animals/bbc_giant-toad_nhu0501904.mp3"
    //console.log({audioUrl})

    // custom duration - seconds
    const duration = url.searchParams.has( "du" )
        ? url.searchParams.get( "du" ) * 1000
        : DEFAULT_DURATION
    //console.log({duration})

    // fake a track
    const track = fakeTrack( {
        slug: params.filename,
        sketchpath,
        duration,
        audioUrl,
        params: {}
    } )
    // console.log({track})


    // audio resource list
    const audioResourcesUrl= `${PUBLIC_MEDIA_API_URL}/audio`
    const resources = await getAudioResources( fetch( audioResourcesUrl) )
    console.log({audioResourcesUrl,resources})

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
    // console.log({data})

    // logging
    if ( url.searchParams.has( 'log' ) ) {
        console.log( 'sketch.data', JSON.stringify( data, null, 2 ) )
        console.log( 'sketch.track', JSON.stringify( track, null, 2 ) )
    }

    return data
}
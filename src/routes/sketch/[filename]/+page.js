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
    const audioResources = await getAudioResources( fetch( 'https://mm-media.netlify.app/.netlify/functions/audio' ) )
    const sketchSlug = params.filename
    const sketchPath = `/src/routes/sketch/${ params.filename }.js`

    const audioUrl = url.searchParams.has( "audioUrl" )
        ? url.searchParams.get( "audioUrl" )
        : null

    return {
        audioUrl,
        audioResources,
        sketchPath,
        sketchSlug
    }
}
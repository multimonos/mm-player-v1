export const load = ( { params } ) => {
    console.log( { params } )

    const ids = params.trackUri
        ? params.trackUri.split( ":" ).slice( 0, 2 )
        : [ false, false ]

    const sketchId = ids.length===2 ? ids[0]:false
    const trackId = ids.length===2 ? ids[1]:false

    // const url="http://localhost:7770/sketch-draft/create/test1.bundle.js"
    const url="http://localhost:7770/sketch-draft/sketchv2/test1.bundle.js"

    console.log( { sketchId, trackId } )

    return{
        sketchId,
        trackId,
        url,
    }
}
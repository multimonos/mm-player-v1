import { error } from "@sveltejs/kit"
import { createShareAlbumMeta, createShareTrackMeta } from "$lib/model/meta-factory.js"


const fetchResource = async fn => {
    const res = await fn()
    return res.json()
}

export const load = async ( { fetch, params } ) => {

    // validate
    const [ ns, resource, albumId, trackId ] = params.uri.split( ':' )

    // errors
    if ( ! resource ) throw error( 400, 'Resource not defined' )
    if ( ! albumId ) throw error( 400, 'Resource ID not defined' )

    // response
    const defaults = {
        uri: params.uri,
        ns,
        resource,
        item: null
    }

    // console.log( { defaults } )
    switch ( resource ) {
        case "album":
            const { album } = await fetchResource( () => fetch( `/api/albums/${ albumId }` ) )
            // console.log({album})
            return {
                ...defaults,
                item: album,
                meta: createShareAlbumMeta( album ),
            }
            break

        case "track":
            const { track } = await fetchResource( () => fetch( `/api/albums/${ albumId }/tracks/${ trackId }` ) )
            return {
                ...defaults,
                item: track,
                meta: createShareTrackMeta( track )
            }
            break

        default:
            throw error( 404, 'Resource not found' )
            break
    }


    return { ...defaults }
}
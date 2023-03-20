import { error } from "@sveltejs/kit"
import { createMeta, createShareAlbumMeta, createShareTrackMeta } from "$lib/model/meta-factory.js"


const fetchResource = async fn => {
    const res = await fn()
    return res.json()
}

const fetchAlbum = async id => {
    const res = await fetch( `/api/albums/${ id }` )
    return res.json()
}

const fetchTrack = async id => {
    const res = await fetch( `/api/tracks/${ id }` )
    return res.json()
}

export const load = async ( { fetch, params } ) => {

    // validate
    const [ ns, resource, id ] = params.uri.split( ':' )
    if ( ! resource ) {
        throw error( 400, 'Resource not defined' )
    }
    if ( ! id ) {
        throw error( 400, 'Resource ID not defined' )
    }

    // response
    const defaults = {
        uri: params.uri,
        ns,
        resource,
        id,
        album: null,
        track: null,
    }

    switch ( resource ) {
        case "album":
            const album = await fetchResource( () => fetch( `/api/albums/${ id }` ) )
            return {
                ...defaults,
                item: album,
                meta:  createShareAlbumMeta( album ) ,
            }
            break

        case "track":
            const track = await fetchResource( () => fetch( `/api/tracks/${ id }` ) )
            return {
                ...defaults,
                item: track,
                meta:  createShareTrackMeta( track )
            }
            break

        default:
            throw error( 404, 'Resource not found' )
            break
    }


    return { ...defaults }
}
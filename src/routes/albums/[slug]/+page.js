import { error } from "@sveltejs/kit"
import { createAlbumMeta } from "$lib/model/meta-factory.js"


const getAlbumContent = async promise => {
    const res = await promise

    if ( !res.ok ) {
        console.error('get content failed')
        return null
    }

    const json = await res.json()

    return json.album.body
}

export const load = async ( { fetch, params } ) => {

    // get album
    const res = await fetch( `/api/albums?slug=${ params.slug }` )

    if ( ! res.ok ) {
        throw error( 404, 'Album not found' )
    }

    const { album } = await res.json()

    // content is optional
    album.body = await getAlbumContent( fetch( `/api/albums/${ album._id }/content` ) )

    const meta = createAlbumMeta( album )

    return {
        album,
        meta,
    }
}
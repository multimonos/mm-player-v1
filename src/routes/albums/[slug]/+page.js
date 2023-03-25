import { error } from "@sveltejs/kit"
import { createAlbumMeta } from "$lib/model/meta-factory.js"


export const load = async ( { fetch, params } ) => {

    const res = await fetch( `/api/albums?slug=${ params.slug }` )

    if ( ! res.ok ) {
        throw error( 404, 'Album not found' )
    }

    const { album } = await res.json()


    const meta = createAlbumMeta( album )

    return {
        album,
        meta,
    }
}
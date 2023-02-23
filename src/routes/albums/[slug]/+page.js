import { error } from "@sveltejs/kit"


export const load = async ( { fetch, params } ) => {
    const res = await fetch( `/api/albums/${ params.slug }` )
    const album = await res.json()

    if ( ! album.id ) {
        throw error( 404, 'Album not found' )
    }

    return {
        album,
    }
}
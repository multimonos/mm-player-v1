import { error, json } from "@sveltejs/kit"
import { albumFindMany, albumFindUnique } from "$lib/service/album-service.js"


export const GET = async ( { url } ) => {

    // handle ?slug=<slug> case
    if ( url.searchParams.has( 'slug' ) ) {
        const album = await albumFindUnique( 'slug', url.searchParams.get( 'slug' ) )

        if ( album === null ) {
            throw error( 404 )
        }

        return json( { album } )
    }

    // default /albums/ case
    const albums = await albumFindMany()

    return json( { albums } )
}
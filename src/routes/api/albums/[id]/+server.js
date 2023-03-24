import { error, json } from "@sveltejs/kit"
import { albumFindUnique } from "$lib/service/album-service.js"


export const GET = async ( { params } ) => {
    const album = await albumFindUnique( 'id', params.id )

    if ( album === null ) {
        throw error( '404' )
    }

    return json( { album } )
}
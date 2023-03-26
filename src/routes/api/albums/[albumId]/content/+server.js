import { error, json } from "@sveltejs/kit"
import { albumFindContent} from "$lib/service/album-service.js"


export const GET = async ( { params } ) => {
    const album = await albumFindContent( params.albumId )

    if ( album === null ) {
        throw error( '404' )
    }

    return json( { album } )
}
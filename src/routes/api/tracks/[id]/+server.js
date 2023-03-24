import { error, json } from "@sveltejs/kit"
import { trackFindUnique } from "$lib/service/track-service.js"


export const GET = async ( { params } ) => {

    const track = await trackFindUnique( 'id', params.id )

    if ( track === null ) {
        throw error( 404 )
    }

    return json( { track } )
}
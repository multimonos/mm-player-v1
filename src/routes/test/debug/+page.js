import { error } from "@sveltejs/kit"


export const load = async ( { fetch } ) => {
    const id = "test-cases-happy-path"
    const res = await fetch( `/api/albums/${ id }` )
    const album = await res.json()

    if ( ! album ) {
        throw error( 404, `test album not found id=${ id }` )
    }

    console.log( { album } )

    return {
        album
    }
}
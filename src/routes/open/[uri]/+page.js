import { error } from "@sveltejs/kit"


export const load = async ( { fetch, params } ) => {

    const [ ns, resource, id ] = params.uri.split( ':' )
    console.log( { ns, resource, id } )
    switch ( resource ) {
        case "albums":
            const res = await fetch( `/api/albums/${ id }` )
            const album = await res.json()
            console.log({album})
            return {
                tracks: album.tracks
            }
            break

        default:
            throw error( 404, 'Resource not found' )
            break
    }
    // const res = await fetch( `/api/albums/${ params.uri }` )
    //
    // const album = await res.json()
    //
    // if ( ! album.id ) {
    //     throw error( 404, 'Album not found' )
    // }

    return { }
}
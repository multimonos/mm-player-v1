import { error } from "@sveltejs/kit"


export const load = async ( { fetch, params } ) => {
    const [ ns, resource, id ] = params.uri.split( ':' )

    const defaults = {
        uri: params.uri,
        ns,
        resource,
        id,
        album: null,
        track: null,
    }

    console.log( { ns, resource, id } )
    switch ( resource ) {
        case "album":
            const res = await fetch( `/api/albums/${ id }` )
            const item = await res.json()
            console.log( { item} )
            return {
                ...defaults,
                item,
            }
            break

        case "track":
            break;
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

    return {}
}
import { error } from "@sveltejs/kit"


export const load = async ( { fetch, params } ) => {
    // validate
    const [ ns, resource, id ] = params.uri.split( ':' )
    if ( ! resource ) {
        throw error( 400, 'Resource not defined' )
    }
    if ( ! id) {
        throw error( 400, 'Resource ID not defined' )
    }

    // response
    const defaults = {
        uri: params.uri,
        ns,
        resource,
        id,
        album: null,
        track: null,
    }

    switch ( resource ) {
        case "album":
            const res = await fetch( `/api/albums/${ id }` )
            const item = await res.json()
            return {
                ...defaults,
                item,
            }
            break

        case "track":
            break
        default:
            throw error( 404, 'Resource not found' )
            break
    }

    return {...defaults}
}
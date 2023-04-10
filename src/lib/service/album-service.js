import { PUBLIC_URL } from "$env/static/public"
import { client } from "$lib/service/sanity-client.js"
import { albumProjection } from "$lib/service/groq/album.js"


const createAlbumQuery = ( { where = '' } = {} ) => {

    const query = `*[_type=='album' ${ where }]{
        ${albumProjection}
    }`
    return query
}

export const albumFindMany = ( options = {} ) => {
    const query = createAlbumQuery( options )
    return client.fetch( query )
}


export const albumFindUnique = ( field, value ) =>
    new Promise( async ( resolve, reject ) => {
        try {
            // very common mappings
            if ( field === 'slug' ) field = 'slug.current'
            if ( field === 'id' ) field = '_id'

            // build query
            const options = { where: `&& ${ field } == "${ value }"` }
            const query = createAlbumQuery( options )

            const rs = await client.fetch( query )
            // console.log({rs})

            return rs.length === 1
                ? resolve( rs[0] )
                : resolve( null ) // nothing valid found

        } catch ( e ) {
            reject( e )
        }
    } )

export const albumFindContent = id => {
    const query = `*[_type == 'album' && _id == '${id}'][0]{ _id, body}`
    // console.log({query})
    return client.fetch(query)
}
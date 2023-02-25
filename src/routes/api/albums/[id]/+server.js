import { albums } from "../albums.js"
import { json } from "@sveltejs/kit"


export const GET = async ( { params } ) => {
    // const id = url.searchParams.get('id')
    // console.log( { params } )
    const slugOrID = params.id

    const key = slugOrID.length === 32
        ? 'id'
        : 'slug'

    const album = albums.find( a => a[key] === slugOrID )

    return json( { ...album } )
}
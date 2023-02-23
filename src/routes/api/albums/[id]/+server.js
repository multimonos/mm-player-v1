import { albums } from "../albums.js"
import { json } from "@sveltejs/kit"


export const GET = async ( {params}) => {
    // const id = url.searchParams.get('id')
    console.log({params})
    const album = albums.find(a=>a.id === params.id)
    return json( { ...album } )
}
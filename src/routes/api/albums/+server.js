import { albums } from "./albums.js"
import { json } from "@sveltejs/kit"


export const GET = async ( event ) => {
    return json( { albums } )
}
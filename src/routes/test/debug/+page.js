import { error } from "@sveltejs/kit"


export const load = async ( { fetch } ) => {
    // const slug= "happy-path-test-cases"
    // const url = `/api/albums/?slug=${slug}`
    // console.log({url})
    // const res = await fetch( url)
    // const { album } = await res.json()
    // console.log( { url, album } )
    const album = null

    // if ( ! album ) {
        // throw error( 404, `test album not found slug=${ slug }` )
    // }


    return {
        album
    }
}
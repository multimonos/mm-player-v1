const app_id = '640b34a46b453b3a2e1e5293'
const url = 'https://dummyapi.io/data/v1/post?limit=30'

export const load = async ( { fetch } ) => {
    // get the albums
    const res = await fetch( url, {
        headers: {
            'app-id': app_id
        }
    } )
    // console.log( { res } )
    const json = await res.json()
    console.log( { json } )
    const albums = json.data

    return {
        albums,
    }
}

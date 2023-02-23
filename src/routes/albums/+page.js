export const load = async ( { fetch } ) => {
    // get the albums
    const res = await fetch( '/api/albums' )
    const data = await res.json()
    const albums = data.albums

    return {
        albums
    }
}
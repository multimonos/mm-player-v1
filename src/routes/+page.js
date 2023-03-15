import {createMeta} from "$lib/model/meta-factory.js"


const getFakeAlbums = async ( fetch, count ) => {
    const url = `https://dummyapi.io/data/v1/post?limit=${ count }`
    const res = await fetch( url, {
        headers: {
            'app-id': '640b34a46b453b3a2e1e5293'
        }
    } )

    const json = await res.json()

    const data = json.data
        .map( ( o, i ) => ({
            id:i,
            images: [{url:o.image}],
            name: o.text,
            type: 'album',
            album_type: 'album',
        }) )

    console.log(JSON.stringify(data,null,2))

    return data
}

const getAlbums = async ( fetch ) => {
    // get the albums
    const res = await fetch( '/api/albums' )
    const data = await res.json()
    return data.albums
}

export const load = async ( { fetch } ) => {
    // get the albums

    // console.log( { res } )
    // const albums = await getFakeAlbums( fetch, 48 )
    const albums = getAlbums( fetch )

    return {
        albums,
        meta: createMeta([
            {name: 'title', content:'multimonos'}
        ])
    }
}

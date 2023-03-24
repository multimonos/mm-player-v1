import {createMeta} from "$lib/model/meta-factory.js"


const getAlbums = async ( fetch ) => {
    // get the albums
    const res = await fetch( '/api/albums' )
    const data = await res.json()
    return data.albums
}

export const load = async ( { fetch } ) => {
    // get the albums

    // console.log( { res } )
    const albums = getAlbums( fetch )

    return {
        albums,
        meta: createMeta([
            {name: 'title', content:'Home | multimonos'}
        ])
    }
}

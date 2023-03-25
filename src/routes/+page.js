import {createMeta} from "$lib/model/meta-factory.js"
import {getHomepage} from "$lib/service/homepage-service.js"


const getAlbums = async ( fetch ) => {
    // get the albums
    const res = await fetch( '/api/albums' )
    const data = await res.json()
    return data.albums
}

export const load = async ( { fetch } ) => {
    // get the albums

    const content = await getHomepage()
console.log(JSON.stringify(content,null,2))
    const albums = getAlbums( fetch )

    return {
        albums,
        content,
        meta: createMeta([
            {name: 'title', content:'Home | multimonos'}
        ])
    }
}

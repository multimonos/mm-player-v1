import { albumFindMany, albumFindUnique } from "$lib/service/album-service.js"


export const load = async () => {

    // albumm
    const albumSlug = 'rgb'
    const album = await albumFindUnique( 'slug', albumSlug )

    // albums
    const albums = await albumFindMany()

    return {
        album,
        albums,
    }


}

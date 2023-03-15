import { createShareable } from "$lib/com/share/sharing.js"

export const createAlbumShare = album => createShareable({
    url: album.links.share,
    image: album.images?.[0].url,
    title: `${ album.name } by multimonos`,
})
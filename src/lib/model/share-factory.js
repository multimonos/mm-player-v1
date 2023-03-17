import { createShareable } from "$lib/com/share/sharing.js"

export const createAlbumShare = album => createShareable({
    modalTitle: `Share ${album.name}?`,
    url: album.links.share,
    image: album.images?.[0].url,
    title: `${ album.name } by multimonos`,
})
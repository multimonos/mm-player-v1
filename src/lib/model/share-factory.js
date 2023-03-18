import { createShareable } from "$lib/com/share/sharing.js"
import { firstOfProp } from "$lib/util/array.js"


export const createAlbumShare = album => createShareable( {
    modalTitle: album.name,
    url: album.links.share,
    image: firstOfProp( album.images, 'url' ),
    title: `${ album.name } by multimonos`,
} )

export const createTrackShare = track => createShareable( {
    modalTitle: track.name,
    url: track.links.share,
    image: firstOfProp( track.album.images, 'url' ),
    title: `${ track.name } - ${ track.album.name }`,
} )
import { createShareable } from "$lib/com/share/sharing.js"
import { imageUrl } from "$lib/service/sanity-client.js"


export const createAlbumShare = album => createShareable( {
    modalTitle: album.name,
    url: album.links.share,
    image: imageUrl( album.poster, { width: 1200, height: 630, auto: 'format' } ),
    title: `${ album.name } by multimonos`,
} )

export const createTrackShare = track => createShareable( {
    modalTitle: track.name,
    url: track.links.share,
    image: imageUrl( track.album.poster, { width: 1200, height: 630, auto: 'format' } ),
    title: `${ track.name } - ${ track.album.name } by multimonos`,
} )
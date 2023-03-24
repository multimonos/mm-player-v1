import { createShareable } from "$lib/com/share/sharing.js"


export const createAlbumShare = album => createShareable( {
    modalTitle: album.name,
    url: album.links.share,
    image: `${album.poster.url}?w=1200&h=630&auto=format`,
    title: `${ album.name } by multimonos`,
} )

export const createTrackShare = track => createShareable( {
    modalTitle: track.name,
    url: track.links.share,
    image: `${track.album.poster.url}?w=1200&h=630&auto=format`,
    title: `${ track.name } - ${ track.album.name } by multimonos`,
} )
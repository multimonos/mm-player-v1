import { createShareable } from "$lib/com/share/sharing.js"

export const createAlbumShare = album => createShareable({
    modalTitle: `${album.name}? album`,
    url: album.links.share,
    image: album.images?.[0].url,
    title: `${ album.name } by multimonos`,
})

export const createTrackShare = track => createShareable({
    modalTitle: `${track.name} track`,
    url: track.links.share,
    image: track.album.images?.[0].url,
    title: `${ track.name } - ${track.album.name}`,
})
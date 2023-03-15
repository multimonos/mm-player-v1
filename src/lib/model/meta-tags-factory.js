import { site } from "$lib/config/site.js"
import { titlecase, tracksDuration } from "$lib/util/string.js"


export const createMetaTags = ( type, model ) => {
    const defaults = createDefaultMetaTags( site )

    let tags = []

    if ( 'share.album' === type ) {
        tags = createShareAlbumMetaTags( model )

    } else if ( 'share.track' === type ) {
        tags = createShareTrackMetaTags( model )
    }

    return [ ...defaults, ...tags ]
}

export const createDefaultMetaTags = site => [
    { name: 'author', content: site.author },
    { name: 'keywords', content: site.keywords },
    { name: 'description', content: site.description },
]

export const createShareAlbumMetaTags = album => [
    { name: 'title', content: `${ album.name } by multimonos | ${ titlecase( album.album_type ) } Share | Play all tracks` },
    { property: 'og:url', content: album.links.share },
    { property: 'og:title', content: `${ album.name }` },
    {
        property: 'og:description',
        content: `${ album.name } by multimonos is a ${ album.tracks.length } track multimedia ${ album.album_type }. Running time of ${ tracksDuration( album.tracks ) }.`
    },
    { property: 'og:determiner', content: 'the' },
    { property: 'og:locale', content: 'en_CA' },
    { property: 'og:image', content: album.images?.[0].url },
    { property: 'og:image:alt', content: `Poster for the ${ album.name } ${ titlecase( album.album_type ) }` },
    { property: 'og:type', content: `multimonos:${ album.album_type }` },
]

export const createShareTrackMetaTags = track => [
    {
        name: 'title',
        content: `${ track.name } by multimonos | ${ track.album.name } ${ titlecase(track.album.album_type) } | Track Share | Play track`
    },
    { property: 'og:url', content: track.links.share },
    { property: 'og:title', content: `${ track.name }` },
    {
        property: 'og:description',
        content: `${ track.name } ${ titlecase( track.type ) } by multimonos is a multimedia track off the ${ track.album.album_type } ${ track.album.name }. Running time of ${ tracksDuration( track ) }.`
    },
    { property: 'og:determiner', content: 'the' },
    { property: 'og:locale', content: 'en_CA' },
    { property: 'og:image', content: track.album.images?.[0].url },
    { property: 'og:image:alt', content: `Poster for the ${ track.name } off the ${ track.album.album_type } ${ track.album.name }` },
    { property: 'og:type', content: `multimonos:${ track.type }` },
]
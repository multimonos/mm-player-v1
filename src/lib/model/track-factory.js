export const createTrack = (
    {
        id,
        name,
        duration = false,
        media, // @deprecate for "sketch_path"
        image,
        album, // track is a member of only one album
    }
) => (
    {
        id,
        type: 'track',
        name,
        duration,
        media,
        image,
        href: `/api/tracks/${ id }`, // link to web api endpoint with full details
        album,
    }
)

/**
 * creates the album data for a track...should be mvp only
 */
export const createTrackAlbum = (
    {
        id,
        album_type,
        images = [],
        name,
        tags = [],
        artists = [],
    }
) => (
    {
        id,
        type: "album",
        album_type,
        name,
        images,
        tags,
        artists,
        href: `/api/tracks/${ id }`, // link to web api endpoint with full details
    }
)

export const createTrack = (
    {
        id,
        slug,
        name,
        duration = false,
        media,
        image,
        album,
        links = {}
    }
) => (
    {
        id,
        type: 'track',
        slug,
        name,
        duration,
        media,
        image,
        album,
        links,
    }
)

/**
 * creates the album data for a track...should be mvp only
 */
export const createTrackAlbum = (
    {
        id,
        slug,
        album_type,
        images = [],
        name,
        tags = [],
        artists = [],
        links,
    }
) => (
    {
        id,
        slug,
        type: "album",
        album_type,
        name,
        images,
        tags,
        artists,
            links,
    }
)

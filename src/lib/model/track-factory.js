export const createTrack = (
    {
        id,
        name,
        image,
        type = 'track',
        track_path, // @deprecate for "sketch_path"
        // sketch, ... this is Media now.
        album, // track is a member of only one album
    }
) => (
    {
        id,
        type,
        name,
        // sketch,
        image,
        track_path,
        album,
    }
)

/**
 * creates the album data for a track...should be mvp only
 */
export const createTrackAlbum = (
    {
        id,
        type = 'album',
        album_type,
        bg_color,
        images = [],
        name,
        total_tracks,
        tags = [],
        // tracks = [],
        artists = [],
    }
) => (
    {
        id,
        type,
        album_type,
        name,
        bg_color,
        images,
        total_tracks,
        // tracks = [],
        tags,
        artists,
    }
)

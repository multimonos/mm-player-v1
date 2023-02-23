export const createAlbum = (
    {
        id,
        type = 'album',
        album_type,
        bg_color,
        images = [],
        title,
        name,
        track_paths = [],
        tracks = [],
        tags = [],
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
        total_tracks: track_paths.length,
        track_paths,
        tracks,
        tags,
        artists,
    }
)

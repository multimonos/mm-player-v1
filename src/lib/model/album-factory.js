export const createAlbum = (
    {
        id,
        slug,
        album_type,
        bg_color,
        images = [],
        title,
        name,
        // media = [],
        tracks = [],
        tags = [],
        artists = [],
        links = { }
    }
) => (
    {
        id,
        slug,
        type: "album",
        album_type,
        name,
        bg_color,
        images,
        // media,
        tracks,
        tags,
        artists,
        links,
    }
)

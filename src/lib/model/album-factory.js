export const createAlbum = (
    {
        id,
        album_type,
        bg_color,
        images = [],
        title,
        name,
        // media = [],
        tracks = [],
        tags = [],
        artists = [],
    }
) => (
    {
        id,
        type: "album",
        album_type,
        name,
        bg_color,
        images,
        // media,
        tracks,
        tags,
        artists,
        href: `/api/albums/${id}`, // link to web api endpoint with full details
    }
)

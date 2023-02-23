export const createArtist = (
    {
        id,
        name, // proper name of the artist
        images,
    } ) => (
    {
        id,
        type: "artist",
        name,
        images,
        href: `/api/artists/${id}`,
    }
)
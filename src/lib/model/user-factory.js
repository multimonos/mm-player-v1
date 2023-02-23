export const createUser = (
    {
        id,
        type = 'user',
        name = '',
        images = [],
        website,
        social = [],
    }
) => (
    {
        id,
        type,
        name,
        images,
        website,
        social,
    }
)


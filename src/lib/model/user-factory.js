export const createUser = (
    {
        id,
        type = 'user',
        username,
        firstname = '',
        lastname = '',
        images = [],
        website,
        social = [],
    }
) => (
    {
        id,
        type,
        username,
        firstname,
        lastname,
        images,
        website,
        social,
    }
)


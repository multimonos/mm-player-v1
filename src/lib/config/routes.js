
export const routes =  {
    '@home': () => '/',
    '@queue': () => `/queue`,

    // '@album': album => `/albums/${ album.id }`,
    // '@albums': () => `/albums`,
    // '@artist': artist => `/artists/${ artist.username }`,
    // '@artists': () => `/artists`,
    // '@doc': slug => `/doc/${ slug }`,
    // '@docs': () => `/docs`,
    // '@play': () => `/play`,
    // '@track': track => `/play/${ track.album.id }/${ track.id }`,
    // '@post': slug => `/blog/${ slug }`,
    // '@posts': () => `/blog`,
}


// accessor for provider scripts
export const route = ( alias, ...params ) => {
    if ( ! routes.hasOwnProperty( alias ) ) {
        console.error( 'route does not exist', { alias }, { params } )
        return 'invalid-route'
    }

    if ( ! typeof routes[alias] === 'function' ) {
        console.error( 'route fn does not exist', { alias }, { params } )
        return 'invalid-route'
    }

    return routes[alias]( ...params )
}
export const routes = {
    '@home': () => '/',
    // '@queue': () => `/queue`,
    '@album': album => `/albums/${ album.slug }`,
    // '@albums': () => `/albums`,
    '@debug': () => `/test/debug`,
    '@artist': artist => `/artists/${ artist._id }`,
    '@player': () => `/player`,
    // '@artists_api': artist => `/api/artists/${ artist.id }`,
    // '@albums_api': album => `/api/albums/${ album.id }`,
    // '@tracks_api': track => `/api/tracks/${ track.id }`,
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
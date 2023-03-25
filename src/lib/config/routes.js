export const routes = {
    '@home': () => '/',
    '@album': album => `/albums/${ album.slug }`,
    '@debug': () => `/test/debug`,
    '@player': () => `/player`,
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
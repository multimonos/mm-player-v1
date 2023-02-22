import { PUBLIC_DEBUG } from "$env/static/public"


console.log( 'debug', PUBLIC_DEBUG === true )

export const delayIfDebug = ( fn, delay ) => {
    if ( PUBLIC_DEBUG === 'true' ) {
        setTimeout( fn, delay )
    } else {
        fn()
    }
}

export const debug = ( ...args ) =>
    PUBLIC_DEBUG === 'true' && console.log( ...args )


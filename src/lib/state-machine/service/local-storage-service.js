import { browser } from "$app/environment"


export const initFromLocalStorage = ( key, defaultValue ) => {
    if ( browser && window.localStorage.getItem( key ) ) {
        return JSON.parse( window.localStorage.getItem( key ) )
    }
    return defaultValue
}

export const saveToLocalStorage = ( key, value ) => {
    if ( browser ) {
        window.localStorage.setItem( key, JSON.stringify( value ) )
        return true
    }
    return false
}

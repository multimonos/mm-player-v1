export const firstOfProp = ( list, prop, resultIfFalse = '' ) => {
    if ( ! Array.isArray( list ) || list.length === 0 ) return resultIfFalse
    if ( typeof list[0] !== 'object' ) return resultIfFalse
    if ( ! list[0][prop] ) return resultIfFalse

    return list[0][prop]
}
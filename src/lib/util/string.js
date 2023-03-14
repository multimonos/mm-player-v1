export const commaIf = cond =>
    cond ? ', ' : ''

export const suffixIf = ( cond, word, suffix = 's' ) =>
    cond ? `${ word }${ suffix }` : word

export const titlecase = str =>
    str.split(/\b/g)
        .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
        .join(' ')

const getCircularReplacer = () => {
    const seen = new WeakSet()

    return ( key, value ) => {
        if ( typeof value === "object" && value !== null ) {
            if ( seen.has( value ) ) {
                return
            }
            seen.add( value )
        }
        return value
    }
}

export function fy( obj ) {
    let cache = []
    let str = JSON.stringify( obj, function ( key, value ) {
        if ( value === null ) return "null"
        if ( typeof value === "object" && value !== null ) {
            if ( cache.indexOf( value ) !== -1 ) {
                // Circular reference found, discard key
                return
            }
            // Store value in our collection
            cache.push( value )
        }
        return value
    }, 2 )
    cache = null // reset the cache
    return str
}
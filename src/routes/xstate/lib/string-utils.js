// const fyReplacer = ( key, value ) => {
//     try {
//
//    console.log(typeof value,{value})
//         if ( typeof value === 'function' ) return value.name || 'function'
//         if ( value === null ) return "null"
//         return value
//     } catch ( e ) {
//         return e
//     }
//
//     }

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
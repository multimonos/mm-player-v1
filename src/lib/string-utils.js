    const fyReplacer = ( key, value ) => {
        if ( typeof value === 'function' ) return value.name
        if ( value === null ) return "null"
        return value

    }
    export const fy = o => JSON.stringify( o, fyReplacer, 2 )
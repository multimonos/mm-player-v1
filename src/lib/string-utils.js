    import {stringify}  from "flatted"
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
    export const fy = o => stringify( o, null, 2)
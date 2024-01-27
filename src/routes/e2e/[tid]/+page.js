export const load = async ( { params } ) => {

    const replacer = ( match, s0 ) => {
        return s0.toUpperCase()
    }

    const com = (params.tid || "NotFound")
        .trim()
        .replace( /(^\w)/g, replacer )
        .replace( /-(\w)/g, replacer )
    
    const tid = `Test${com}`

    return {
        tid,
        com,
    }
}
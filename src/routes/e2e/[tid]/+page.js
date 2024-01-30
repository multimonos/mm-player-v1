const createTest = filepath => {
    // @see https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
    const path = filepath.replace( "/src/routes/e2e/", "" )

    const com = filepath.replace( /.+\//, "" ).replace( ".svelte", "" )

    const name = filepath
        .replace( /.+Test/, "" )
        .replace( /([A-Z])/g, ( match, s ) => ` ${s}` )
        .trim()
        .replace( ".svelte", "" )

    const slug = filepath
        .replace( /([A-Z])/g, ( match, s ) => `-${s.toLowerCase()}` )
        .replace( /.+test-/, "" )
        .replace( ".svelte", "" )

    const url = `/e2e/${slug}`

    return {
        name,
        com,
        slug,
        url,
        path,
    }
}

export const load = async ( { params } ) => {

    const testpaths = await import.meta.glob( `/src/routes/e2e/**/Test*.svelte` )

    const tests = Object.keys( testpaths )
        .reduce( ( list, path ) => {
            return [
                ...list,
                createTest( path ),
            ]
        }, [] )

    const tid = params.tid || "not-found"

    // console.log( { tid, tests, } )

    return {
        tid,
        tests,
    }
}
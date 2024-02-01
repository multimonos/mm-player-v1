import { PUBLIC_SKETCH_API_BASEURI } from "$env/static/public";

export const sketchurl = path => {
    return `${PUBLIC_SKETCH_API_BASEURI}${path}`
}

export const createTest = filepath => {

    // @see https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations

    const path = filepath

    const basename = filepath.replace( "/src/routes/e2e/", "" )

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
        basename,
    }
}

export const createTests = async () =>{

    const testpaths = await import.meta.glob( `/src/routes/e2e/Test*.svelte` )

    const tests = Object.keys( testpaths )
        .reduce( ( list, path ) => {
            return [
                ...list,
                createTest( path ),
            ]
        }, [] )

    return tests
}
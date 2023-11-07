const makeSketch =  path => ({
    path: path.replace( '/src/routes/sketch/sketches/', '' ),
    url: `/sketch/${path.replace('.js','').replace( '/src/routes/sketch/sketches/', '' ).replace( /^\//, '' ).replace('/','%2F')}` ,
})

export const load = async ( { params } ) => {
    // glob for sketches
    const modules = import.meta.glob( `/src/routes/sketch/sketches/**/*.js` ) // must be string
    console.log( { modules } )

    // build data
    const sketches = Object.keys( modules ).map( makeSketch )
    console.log( { sketches } )

    return {
        sketches
    }

}
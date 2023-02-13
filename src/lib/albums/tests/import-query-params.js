export const meta = {
    id: 'import-query-param',
    name: 'import-query-param',
    description: 'this is the import-query-param sketch',
    duration: 3000,
}


// helper fns
////////////////////
const delay = async ( duration, name ) => {
    console.log( `sketch.delay.${ name }.begin`, duration )

    return new Promise( resolve => setTimeout( () => {
        console.log( `sketch.delay.${ name }.end`, duration )
        resolve( true )
    }, duration ) )
}


// draw fns
////////////////////
const drawBackground = p => {
    p.fill( 67, 213, 242 )
    p.rect( 0, 0, p.width, p.height )
}

const drawCircle = p => {
    // rotating circle
    const r = 50
    const da = Math.PI / 50
    const x = r * Math.cos( p.frameCount * da )
    const y = r * Math.sin( p.frameCount * da )
    p.fill( 255 )
    p.noStroke()
    p.circle( p.width / 2 + x, p.height / 2 + y, 20, 20 )
}


const drawText = text => p => {
    p.fill( 3, 103, 166 )
    p.textAlign( p.CENTER )
    p.textSize( 32 )
    p.text( text, p.width / 2, p.height / 2 )
}


// the sketch
////////////////////
export const sketch = p => {

    let log = true
    let params

    p.setup = () => {
        p.createCanvas( 400, 400 )
        console.log( `setup ${ meta.name }` )
        console.log( 'import.meta.url', import.meta.url )

        // init query params
        const url = new URL( import.meta.url )
        params = url.searchParams
    }

    p.draw = () => {
        drawBackground( p )
        drawCircle( p )
        drawText( params.toString() )(p)

        // log to console
        log && console.log()
        log = false
    }
}

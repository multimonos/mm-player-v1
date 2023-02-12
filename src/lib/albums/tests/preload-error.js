export const meta = {
    id: 'preload',
    name: 'preload',
    description: 'this is the preload sketch',
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
    p.fill( 189, 42, 46 )
    p.rect( 0, 0, p.width, p.height )
}

const drawCircle = p => {
    // rotating circle
    const r = 50
    const da = Math.PI / 50
    const x = r * Math.cos( p.frameCount * da )
    const y = r * Math.sin( p.frameCount * da )
    p.fill( 0 )
    p.noStroke()
    p.circle( p.width / 2 + x, p.height / 2 + y, 20, 20 )
}


// the sketch
////////////////////
export const sketch = p => {


    let foobar // dummy resource we need in the draw loop
    let log = true // just to prevent too many console.log() happening

    /**
     * This param is the core part of the pattern.  Use it to guard against
     * drawing in the draw() loop until the assets assigned in the
     * prepare() function are available.
     *
     * @type {boolean}
     */
    let ready = false // do we have everything we need to draw()


    /**
     * The p5js preload() method is not blocking when async await calls are made,
     * so, we need to setup a simple  way to prepare / fetch assets that are
     * need in the draw loop.
     *
     * This function is called by the framework if it exists and forces the
     * StateMachine into the `preparing:async` state.
     *
     * @returns {Promise<Boolean|ErrorObject>}
     */
    p.prepare = () => { // Method is called by the framework when it exists

        console.log( 'sketch.prepare()' )

        return new Promise( async ( resolve, reject ) => {
            try {

                await delay( 2000, 'one' )
                console.log(Math.random())

                if ( Math.random() > 0.5 ) {
                    throw new Error( '🦊 fox error!' )
                } else {
                    throw new Error( '🙈 monkey error!' )
                    // a = b // always throws
                }

                console.log( 'sketch.prepare() resolved' )

            } catch ( e ) {
                reject( e )
            }
        } )
    }

    p.setup = async () => {
        p.createCanvas( 400, 400 )
        console.log( 'sketch.setup().foobar', { foobar }, '- should not exist yet' )
    }

    p.draw = () => {
        drawBackground( p )
        drawCircle( p )

        // don't consume anything that hasn't been assigned yet
        if ( ! ready ) { // early exit
            return
        }

        // log to console
        log && console.log( 'sketch.draw().foobar', { foobar }, p.someOtherAsset )
        log = false
    }
}

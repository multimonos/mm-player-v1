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

const drawFoobarValue = text => p => {
    p.fill( 0 )
    p.textAlign( p.CENTER )
    p.textSize( 64 )
    p.text( text, p.width / 2, p.height / 3 )
}

const drawSomeOtherValue = text => p => {
    p.fill( 3, 103, 166 )
    p.textAlign( p.CENTER )
    p.textSize( 32 )
    p.text( text, p.width / 2, p.height * 2 / 3 )
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
            // simulate fetching of resources
            await delay( 1000, 'one' )
            await delay( 3000, 'two' )
            await delay( 2000, 'three' )

            // set data we need in the draw loop
            foobar = 'bam'
            p.someOtherAsset = 'heck yah!'


            ready = true // remove the draw() loop guard

            console.log( 'sketch.prepare() resolved' )

            resolve( true )
        } )
    }

    p.setup = async () => {
        p.createCanvas( 400, 400 )

        console.log( 'sketch.setup().foobar', { foobar }, '- should not exist yet' )
    }

    p.draw = () => {
        // this is ok!  we can still draw here something for the user to see while
        // our other assets are being loaded async ... we just can't depend on
        // foobar or p.someOtherAsset to have a value yet, so, don't conume
        // them.
        drawBackground( p )
        drawCircle( p )


        // don't consume anything that hasn't been assigned yet
        if ( ! ready ) { // early exit
            return
        }


        // draw some text with late assigned vars
        drawFoobarValue( foobar )( p )
        drawSomeOtherValue( p.someOtherAsset )( p )

        // log to console
        log && console.log( 'sketch.draw().foobar', { foobar }, p.someOtherAsset )
        log = false
    }
}

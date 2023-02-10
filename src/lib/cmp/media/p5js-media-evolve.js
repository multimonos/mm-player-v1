// adds all the extra methods that we may need to work within a "media player" context

const pipe = ( ...fns ) => x => fns.reduce( ( y, f ) => f( y ), x )

const evoleIfNotExists = ( prop, fn ) => p5i => {
    if ( ! p5i[prop] ) {
        // console.log( 'should evolve', prop )
        p5i[prop] = fn( p5i )
    }
    return p5i
}

// media player interface methods
////////////////////////////////////////
const pause = p5i => () => {
    if ( ! p5i ) return
    p5i.noLoop()
}

const resume = p5i => () => {
    if ( ! p5i ) return
    p5i.loop()
}

const play = p5i => () => {
    if ( ! p5i ) return
    p5i.loop()
}

const screenshot = p5i => track => {
    if ( ! p5i ) return

    const tag = new Date( Date.now() )
        .toISOString()
        .replace( /:\d+\.\d+Z$/g, '' )
        .replace( /\W/g, '' )
        .replace( /\D/g, '-' )

    if ( track && track.name ) {
        p5i.save( `${ track.name }-${ tag }.png` )
    } else {
        p5i.save( `${ tag }.png` )
    }
}

/**
 * Evolve p5js instance with media player interface methods
 * that we may need for playback and other controls.
 *
 * Note: We only add methods that do not already exist.
 *
 * @param a p5js Instance ( already mounted to dom with new p5( sketch, canvasNode )
 * @returns p5jsInstance
 */
export const p5jsMediaEvolve = p5i =>
    pipe(
        evoleIfNotExists( 'pause', pause ),
        evoleIfNotExists( 'resume', resume ),
        evoleIfNotExists( 'play', play ),
        evoleIfNotExists( 'screenshot', screenshot ),
    )( p5i )

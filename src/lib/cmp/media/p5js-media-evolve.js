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
    p5i?.audioContext?.suspend?.() // This is a convention only.
}

const play = p5i => () => {
    if ( ! p5i ) return
    p5i.loop()
    p5i?.audioContext?.resume?.() // This is a convention only.
}

const destroy = p5i => async () => {
console.log('destroy was called on', p5i)
    await p5i?.audioContext?.close?.() // This is a convention only.
}

const screenshot = p5i => track => {
    if ( ! p5i ) return

    const tag = new Date( Date.now() )
        .toISOString()
        .replace( /:\d+\.\d+Z$/g, '' )
        .replace( /\W/g, '' )
        .replace( /\D/g, '-' )

    if ( track && track.name ) {
        p5i.save( `${ track.name }_${ tag }.png` )
    } else {
        p5i.save( `${ tag }.png` )
    }
}

/**
 * Evolve p5js instance with our media player interface methods,
 * so, that we may need for playback and other controls.
 *
 * NOTES
 * - we only add methods that do not already exist.
 * - the `audioContext` can be attached to the p5js instance, but, doesn't have to be ( convention only )
 * - if the `audioContext` is not attached, by same name, to the p5js instance, then developer should write the own custom pause, play, resume methods
 * @param a p5js Instance ( already mounted to dom with new p5( sketch, canvasNode )
 * @returns p5jsInstance
 */
export const p5jsMediaEvolve = p5i =>
    pipe(
        evoleIfNotExists( 'pause', pause ),
        evoleIfNotExists( 'play', play ),
        evoleIfNotExists( 'destroy', destroy ),
        evoleIfNotExists( 'screenshot', screenshot ),
    )( p5i )

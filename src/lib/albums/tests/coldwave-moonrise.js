import { resources } from "$lib/data/cloudinary.js"
import { createAudioContext, createRemoteAudioSource, floatFrequencyDomainSampler } from "$lib/audio-factory.js"


export const meta = {
    id: 'coldwave-moonrise',
    name: 'coldwave-moonrise',
    description: 'acoldwave-moonrise',
    duration: false,
}

const pickRandomAudioResource = resources =>
    resources
        .filter( r => r.group === 'animals' )
        .sort( () => (Math.random() > .5) ? -1 : 1 )
        .pop()

const dbToRadius = ( maxRadius, db ) => p => {
    const v = db < -140 ? -140 : db
    return p.map( v, -140, 0, 0, maxRadius )
}

export const sketch = p => {

    // constants
    const fftBins = 2048
    const da = 2 * Math.PI / fftBins

    // params + context definable
    let center
    let maxRadius


    // this radius vector will reflect
    const r = p.createVector( 1, 0 ).rotate( Math.PI / 32 )

    p.prepare = async () => {
        console.log( { resources } )
        // create an audio context
        p.audioContext = createAudioContext()
        console.log( p.audioContext )

        const audioResource = pickRandomAudioResource( resources )
        console.log( { audioResource } )

        // create url stream
        const audioSource = await createRemoteAudioSource( audioResource.url )( p.audioContext )
        console.log( { audioSource } )

        // create analyzer
        p.audioAnalyser = p.audioContext.createAnalyser( p.audioContext, fftBins )//createAnalyser( p.audioContext )
        console.log( 'analyser', p.audioAnalyser )

        // wiring
        audioSource.connect( p.audioContext.destination )
        audioSource.connect( p.audioAnalyser )
        audioSource.start()
    }

    p.setup = async () => {
        p.createCanvas( p.windowWidth, p.windowHeight )
        p.frameRate( 50 )
        p.randomSeed( 1 )
        p.background( 0 )

        // params
        center = p.createVector( 0.5 * p.width, 0.5 * p.height )
        maxRadius = Math.min( 700, 0.5 * p.width, 0.5 * p.height )
    }

    p.draw = () => {
        if ( ! p.audioAnalyser ) { // not always available immediately
            return
        }


        // base style
        p.translate( center.x, center.y)
        p.fill( 200, 32 )
        p.noStroke()

        // draw
        // const r = p.createVector( 1, 0 ).rotate( Math.PI / 32 )

        const dbs = floatFrequencyDomainSampler( p.audioAnalyser )

        dbs.forEach( sample => {
            const k = dbToRadius( maxRadius, sample )( p )
            const v = r.copy().mult( k )
            p.circle( v.x, v.y, 1 )
            r.rotate( da )
        } )
    }
}

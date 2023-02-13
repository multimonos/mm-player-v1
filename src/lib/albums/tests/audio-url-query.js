import { resources } from "$lib/data/cloudinary.js"
import {
    byteFrequencyDomainSampler,
    byteTimeDomainSampler,
    createAudioContext,
    createRemoteAudioSource,
    frequencyDomainVisualizer,
    timeDomainVisualizer
} from "$lib/audio-factory.js"


export const meta = {
    id: 'audio-url-query',
    name: 'audio url query tests',
    description: 'audio url query test',
    duration: false,
}

const drawBg = p => {
    p.fill( 145, 183, 217 )
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

const pickRandomAudioResource = resources =>
    resources
        .filter( r => r.group === 'animals' )
        .sort( () => (Math.random() > .5) ? -1 : 1 )
        .pop()


const findWithUrl = ( url, list ) => {
    console.log({url,list})
    const u = new URL( url )
    const key = u.searchParams.has( "key" ) ? u.searchParams.get( "key" ) : null
    const value = u.searchParams.has( "value" ) ? u.searchParams.get( "value" ) : null
    return list.find( item => item[key] === value )
}

export const sketch = p => {

    p.prepare = async () => {

        // get data source from import url
        console.log('import.meta.url',import.meta.url)
        const audioResource = findWithUrl( import.meta.url, resources )
        console.log( { audioResource } )

        // create an audio context
        p.audioContext = createAudioContext()
        console.log( p.audioContext )

        // create url stream
        const audioSource = await createRemoteAudioSource( audioResource.url )( p.audioContext )
        console.log( { audioSource } )

        // create analyzer
        p.audioAnalyser = p.audioContext.createAnalyser( p.audioContext )
        console.log( 'analyser', p.audioAnalyser )

        // wiring
        audioSource.connect( p.audioContext.destination )
        audioSource.connect( p.audioAnalyser )
        audioSource.start()
    }

    p.setup = async () => {
        p.createCanvas( 400, 400 )
        console.log( meta.id, "setup" )
    }

    p.draw = () => {
        drawBg( p )
        drawCircle( p )

        if ( p.audioAnalyser ) { // not always available immediately
            const s0 = byteFrequencyDomainSampler( p.audioAnalyser )
            const s1 = byteTimeDomainSampler( p.audioAnalyser )
            // console.log( { samples } )
            frequencyDomainVisualizer( p )( s0 )
            timeDomainVisualizer( p )( s1 )
        }
    }
}

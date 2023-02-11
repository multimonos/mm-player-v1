import {
    byteFrequencyDomainSampler,
    byteTimeDomainSampler,
    createAudioContext,
    createMicrophoneSource,
    frequencyDomainVisualizer,
    timeDomainVisualizer
} from "$lib/audio-factory.js"


export const meta = {
    id: 'audio-mic',
    name: 'audio mic tests',
    description: 'audio mic',
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

export const sketch = p => {

    p.setup = async () => {
        p.createCanvas( 400, 400 )
        console.log( meta.id, "setup" )

        // create an audio context
        p.audioContext = createAudioContext()
        console.log( p.audioContext )

        // create mic source
        const audioSource = await createMicrophoneSource( p.audioContext )
        console.log( { audioSource } )

        // create analyzer
        p.audioAnalyser = p.audioContext.createAnalyser( p.audioContext )//createAnalyser( p.audioContext )
        console.log( 'in setup()', 'analyser', p.audioAnalyser )

        // wiring
        audioSource.connect( p.audioAnalyser )
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

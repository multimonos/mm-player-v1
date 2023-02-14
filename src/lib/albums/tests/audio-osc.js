import { createAudioContext, createOscillator } from "$lib/web-audio.js"


export const meta = {
    id: 'audio-osc',
    name: 'audio osc tests',
    description: 'blue description',
    duration: false,
}

const drawBg = p => {
    p.fill( 83, 119, 166 )
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

        p.createCanvas( 300, 300 )
        console.log( meta.id, "setup" )

        // create an audio context
        p.audioContext = createAudioContext()
        console.log( p.audioContext )

        // create oscillator
        const audioSource = await createOscillator( p.audioContext )
        console.log( { audioSource } )

        // attache osc to speakers and start
        audioSource.connect( p.audioContext.destination )
        audioSource.start( 0 )
    }

    p.draw = () => {
        drawBg( p )
        drawCircle( p )
    }

    /**
     * NOTE: It is not necessary to create custom pause, play, resume functions
     *       if we create a variable named audioContext attached to the p5
     *       instance as above.
     *
     *       The p5jsMediaEvolve() method will assume the audioContext property
     *       is attached to the p5 instance.
     *
     *       @see p5js-media-evolve.js
     */

    /*
     p.pause = () => {
     p.audioContext.suspend()
     p.noLoop()
     }

     p.play = () => {
     p.audioContext.resume()
     p.loop()
     }

     p.resume = p.play
     */

}

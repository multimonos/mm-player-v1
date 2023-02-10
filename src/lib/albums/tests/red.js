export const meta = {
    id: 'red',
    name: 'red',
    description: 'this is the red sketch',
    duration: 3000,
    image: "https://res.cloudinary.com/multimonos/image/upload/v1674954066/multimonos/sketches/demo/red.png"
}

export const sketch = p => {

    p.setup = () => {
        p.createCanvas( 400, 400 )
        console.log( meta.id, "setup" )
    }

    p.draw = () => {
        // bg
        p.fill( 236, 15, 71 )
        p.rect( 0, 0, p.width, p.height )

        // rotating circle
        const r = 50
        const da = Math.PI / 50
        const x = r * Math.cos( p.frameCount * da )
        const y = r * Math.sin( p.frameCount * da )
        p.fill( 0 )
        p.circle( p.width / 2 + x, p.height / 2 + y, 20, 20 )

        // p.notifyProgress( p.millis())
    }

    // framework hooks
    // p.hookDestroy = () => console.log( meta.id, "hookDestroy" )
    // p.hookDuration = () => 3000
}

export const meta = {
    id: 'blue',
    name: 'Nulla vitae elit libero, a pharetra augue.',
    description: 'blue description',
    duration: 3000,
    image:"https://res.cloudinary.com/multimonos/image/upload/v1674954065/multimonos/sketches/demo/blue.png"
}

export const sketch = p => {

    p.setup = () => {
        p.createCanvas( 400, 400 )
        console.log( meta.id, "setup" )
    }

    p.draw = () => {
        //bg
        p.fill( 2, 44, 122 )
        p.rect( 0, 0, p.width, p.height )
        // rotating circle
        const r = 70
        const da = Math.PI / 80
        const x = r * Math.cos( p.frameCount * da )
        const y = r * Math.sin( p.frameCount * da )
        p.fill( 200 )
        p.noStroke()
        p.circle( p.width / 2 + x, p.height / 2 + y, 10, 10 )
        // p.notifyProgress( p.millis(), 3000 )
    }

    // framework hooks
    // p.hookDestroy = () => console.log( meta.id, "hookDestroy" )
    // p.hookDuration = () => 3000
}

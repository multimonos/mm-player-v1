export const meta = {
    id: 'green',
    name: 'green',
    description: 'second green sketch here',
    duration: 3000,
    image: "https://res.cloudinary.com/multimonos/image/upload/v1674954066/multimonos/sketches/demo/green.png",
}

export const sketch = p => {

    p.setup = () => {
        p.createCanvas( 400, 400 )
        console.log( meta.id, "setup" )
    }

    p.draw = () => {
        p.fill( 8, 115, 83 )
        p.rect( 0, 0, p.width, p.height )

        // rotating circle
        const r = 100
        const da = Math.PI / 50
        const x = r * Math.cos( p.frameCount * da )
        const y = r * Math.sin( p.frameCount * da )
        p.fill( 0 )
        p.circle( p.width / 2 + x, p.height / 2 + y, 20, 20 )

        // p.notifyProgress( p.millis(), 3000 )
    }

    // p.windowResized = () => {
    //     p.resizeCanvas(p.windowWidth, p.windowHeight);
    // this causes a strange bug during "screenshot"
    // }

    // framework hooks
    // p.hookDestroy = () => console.log( meta.id, "hookDestroy" )
    // p.hookDuration = () => 4000
}


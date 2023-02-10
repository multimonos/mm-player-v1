export const meta = {
    id: 'custom-methods-test',
    name: 'custom-methods-test',
    description: 'this is the custom-methods-test sketch',
    duration: 3000,
    image: "https://res.cloudinary.com/multimonos/image/upload/v1674954066/multimonos/sketches/demo/yellow.png"
}

export const sketch = p => {

    p.setup = () => {
        p.createCanvas( 400, 400 )
        console.log( meta.id, "setup" )
    }

    p.pause = () => {
        console.log( 'custom pause method called' )
        p.noLoop()
    }
    p.play = () => {
        console.log( 'custom play method called' )
        p.loop()
    }

    p.draw = () => {
        // bg
        p.fill( 255, 192, 203 )
        p.rect( 0, 0, p.width, p.height )

        // rotating circle
        const r = 50
        const da = Math.PI / 50
        const x = r * Math.cos( p.frameCount * da )
        const y = r * Math.sin( p.frameCount * da )
        p.fill( 0 )
        p.circle( p.width / 2 + x, p.height / 2 + y, 20, 20 )
    }
}

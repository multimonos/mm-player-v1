export const meta = {
    id: 'p5jsWide',
    name: 'Super wide p5js Sketch',
    duration: 10000,
}

export const sketch = p => {

    p.setup = () => {
        p.createCanvas( 4096, 400 )
        console.log( meta.id, "setup" )
        p.background( 242, 46, 98 )
        console.log(p.windowWidth, p.windowHeight)
    }

    p.draw = () => {
        // p.background( 242, 46, 98 )
        // fixed ref circle
        p.push()
        p.noStroke()
        p.fill( 127 )
        p.circle( p.width/2, 50, 40 )
        p.pop()

        // left to right sin wave block covering fullwidth
        p.push()
        p.noStroke()
        p.fill( p.color( 1, 65, 58, 32))
        // p.translate( p.width / 2, 0 )
        const k = p.frameCount % 50
        const x = Math.ceil(Math.sin( p.frameCount * 0.01) * p.width/2 ) + p.width/2
        p.rect( x, p.height / 2, 10, 75 )
        p.pop()

        p.push()
        p.translate(0, 10)
        p.noStroke()
        p.fill( 242, 46, 98 )
        p.rect(0, 0, p.width,100)
        p.fill(0)
        p.textAlign(p.CENTER)
        p.textSize(16)
        p.text(`window : ${p.windowWidth} x ${p.windowHeight}`, p.width/2, 20)
        p.text(`canvas : ${p.width} x ${p.height}`, p.width/2, 50)
        p.text(`x : ${x}`, p.width/2, 80)
        p.pop()
    }
}

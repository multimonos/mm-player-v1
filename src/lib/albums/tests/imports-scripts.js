import { fakeImportDependency } from "$lib/albums/tests/fake.js"
import { v4 as uuidv4 } from "uuid"

export const meta = {
    id: 'yellow',
    name: 'yellow',
    description: 'this is the yellow sketch',
    duration: 3000,
    image: "https://res.cloudinary.com/multimonos/image/upload/v1674954066/multimonos/sketches/demo/yellow.png"
}

export const sketch = p => {

    p.setup = () => {
        p.createCanvas( 400, 400 )
        console.log( meta.id, "setup" )

        fakeImportDependency()
        console.log('depends on uuid', uuidv4())
    }

    p.draw = () => {
        // bg
        p.fill( 251, 191, 84 )
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

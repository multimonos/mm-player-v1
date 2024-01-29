<script>
import SketchPlayer from "./com/sketch/SketchPlayer.svelte";

const meta =  {
    id: 'create-with-object',
    name: 'Create with object',
}

const sketch =  p => {

    const stubPause =()=>{
        // Fake a pause command to the player
        const event = new Event( "sketch-paused")
        window.dispatchEvent( event )
        p.noLoop()
    }

    p.setup = () => {
        p.createCanvas( 400, 400 )

        stubPause()
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

const module ={
    meta,
    sketch,
}

</script>
<SketchPlayer {module}/>
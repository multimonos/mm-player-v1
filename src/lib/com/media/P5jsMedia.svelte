<script>
import { service } from "$lib/state-machine/app-machine.js"
import { createEventDispatcher, onDestroy, onMount } from 'svelte'
import { p5jsMediaEvolve } from "$lib/state-machine/service/p5js-media-evolve.js"

// props
export let media = null

// const
const sketch = media.sketch // expected to exist for this type of media
const dispatch = createEventDispatcher()

// vars
let p5
let p5i
let canvasNode
let shouldCreateP5Instance = false


// reactives
$:  {

    // p5js makes us wait until after onMount() to do this, but, we
    // don't have the "sketch" instance created yet.
    if ( shouldCreateP5Instance ) {
        p5i && p5i.remove && p5i.remove() //&& p5i = null

        // create
        p5i = new p5( sketch, canvasNode )
        p5i = p5jsMediaEvolve( p5i )
        dispatch( 'created', p5i )

        // don't create again
        shouldCreateP5Instance = false
    }

}

// fns
onMount( async () => {
    // dyanmically import p5 as it's 1.3MB
    const module = await import('p5')
    p5 = module.default

    // provide a way get the media context in sketch functions
    const getContext = ctx => () => ctx
    p5.prototype.getContext = getContext( $service.context.media.context )


    if ( sketch ) {
        shouldCreateP5Instance = true
    }
} )

onDestroy( () => {
    p5i && p5i.remove && p5i.remove() //&& p5i = null
} )
</script>

{#if sketch}
    <div class="sketch-canvas" bind:this={canvasNode}></div>
    <!--  <div id="p5_loading" hidden"></div>-->
{/if}
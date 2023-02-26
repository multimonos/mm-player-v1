<script>
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'
    import { p5jsMediaEvolve } from "$lib/state-machine/service/p5js-media-evolve.js"

    // props
    export let sketch
    export let debug = false

    let p5
    let p5i

    // vars
    let canvasNode
    let shouldCreateP5Instance = false
    const dispatch = createEventDispatcher()


    // reactives
    $:  {

        // p5js makes us wait until after onMount() to do this, but, we
        // don't have the "sketch" value set yet.
        if ( shouldCreateP5Instance ) {
            p5i && p5i.remove && p5i.remove() //&& p5i = null

            // create
            p5i = new p5( sketch, canvasNode )
            p5i = p5jsMediaEvolve(p5i)
            dispatch( 'created',  p5i  )

            // don't create again
            shouldCreateP5Instance = false
        }

    }

    // fns
    onMount(async () => {
        // dyanmically import p5 as it's 1.3MB
        const module = await import('p5')
        p5 = module.default

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
{/if}

{#if debug}
    <pre>{JSON.stringify( sketch, null, 2 )}</pre>
{/if}
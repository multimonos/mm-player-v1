<script>
import Sketch from "./Sketch.svelte"
import { createEventDispatcher, onMount } from "svelte"

//props
export let url

// vars
let error
let module
const dispatch = createEventDispatcher()

// fns
const getModule = async url => {
    try {
        const module = await import(/* @vite-ignore */ url)
        return module

    } catch ( e ) {
        // Fail silently.
        return false
    }
}

const canCreateSketch = module =>
    module.createSketch || module.sketch

const createSketch = async module => {
    if ( module.createSketch ) { // factory
        const sketch = await module.createSketch()
        return sketch

    } else if ( module.sketch ) { // vanilla
        const sketch = module.sketch
        return sketch
    }

    return false
}


// lifecycle
onMount( async () => {
    module = await getModule( url )

    module.meta && dispatch( "sketch-meta", module.meta )
} )
</script>

<pre>{JSON.stringify( { url }, null, 2 )}</pre>
{#if module && canCreateSketch( module )}

    {#await createSketch( module )}
        <pre>... loadennerring</pre>

    {:then sketch}
        <Sketch {sketch}/>

    {:catch error}
        <pre>error : {JSON.stringify( error.message, null, 2 )}</pre>
    {/await}
{/if}

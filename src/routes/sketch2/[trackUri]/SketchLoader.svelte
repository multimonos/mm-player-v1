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
        return false /* fail silently */
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

<!--<pre>{JSON.stringify( { url }, null, 2 )}</pre>-->
{#if module && canCreateSketch( module )}

    {#await createSketch( module )}
        <div>
            <span class="loading loading-infinity loading-xs"></span>
        </div>

    {:then sketch}
        <Sketch {sketch}/>

    {:catch error}
        <div class="alert alert-error">
            <span>
                <pre>error : {JSON.stringify( error.message, null, 2 )}</pre>
            </span>
        </div>
    {/await}
{/if}

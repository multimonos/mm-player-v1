<script>
import Sketch from "./Sketch.svelte"
import { createEventDispatcher, onMount } from "svelte"

//props
export let url

// vars
let error
let module
let meta
const dispatch = createEventDispatcher()

// lifecycle
onMount( async () => {
    module = await getModule( url )

    meta = module.meta || {}

    dispatch("sketch-meta",meta)
} )
</script>

<script context="module">
const getModule = async url => {
    try {
        const module = await import(/* @vite-ignore */ url)
        return module
    } catch ( e ) {
        return false /* fail silently */
    }
}

const canCreateSketch = module =>
    module && (module.createSketch || module.sketch)

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
</script>

<!--<pre>{JSON.stringify( { url }, null, 2 )}</pre>-->
{#if canCreateSketch( module )}

    {#await createSketch( module )}
        <div>
            <!-- is this in the correct location? -->
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

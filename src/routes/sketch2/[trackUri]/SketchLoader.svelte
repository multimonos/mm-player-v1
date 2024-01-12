<script>
import Sketch from "./Sketch.svelte"
import { createEventDispatcher, onMount } from "svelte"

//props
export let url

//vars
let sketch = new Promise( () => { /* dummy */ } )
const dispatch = createEventDispatcher()

//lifecylce
onMount( async () => {

    // Get the sketch.
    const module = await import(/* @vite-ignore */url)
    console.log( { module } )

    // Make a sketch.
    if ( module.createSketch ) {
        sketch = await module.createSketch()
        console.log( "sketch.createSketch()" )

    } else if ( module.sketch ) {
        sketch = new Promise( resolve => resolve( module.sketch ) )
        console.log( "sketch.vanillaSketch" )
    }

    if ( module.meta ) {
        console.log("sketch.meta",{meta:module.meta})
        dispatch( "sketch-meta", module.meta )
    }

} )
</script>

<pre>{JSON.stringify( { url, sketch }, null, 2 )}</pre>

{#await sketch}
    ... preparing sketch
{:then _}
    <Sketch {sketch}/>
{/await}
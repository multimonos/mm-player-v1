<script>
import { onDestroy, onMount } from "svelte"

//props
export let sketch

//vars
let canvas
let p5i

//lifecyle
onMount( async () => {
    // p5js requires a "window", so, create must be here.
    const module = await import(/* @vite-ignore */"p5")
    const p5 = module.default
    p5i = new p5( sketch, canvas )
} )

onDestroy( () => {
    p5i && p5i.remove && p5i.remove()
} )
</script>

<div class="sketch-canvas" bind:this={canvas}></div>

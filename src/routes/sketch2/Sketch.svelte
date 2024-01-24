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

onDestroy( async () => {
    p5i && p5i.destroy && p5i.destroy()
    p5i && p5i.remove && p5i.remove()
} )
</script>

{#if ! sketch}
    <div class="alert alert-error">
        <span>No sketch provided.</span>
    </div>
{:else}
    <div class="sketch-canvas z-40 w-full flex justify-center" bind:this={canvas} data-tid="sketch"></div>
{/if}

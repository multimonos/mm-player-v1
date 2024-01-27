<script>
import SketchVariantList from "../com/sketch/SketchVariantList.svelte";
import { goto } from "$app/navigation";

// vars
let meta = {}
const url = "http://localhost:7770/sketch-draft/sketchv2/audio-variants.bundle.js"

//fns
const onSketchMeta = e => {
    meta = e.detail
}

const gotoSketchVariant2 = async ( e ) => {
    // Create params from event detail.
    const { params } = e.detail || {}

    // Create query params as an array of [ name, value ]
    const queryParams = Object.keys( params ).reduce( ( list, k ) => ([ ...list, [ k, params[k] ] ]), [] )

    // Build search params.
    const query = new URLSearchParams( queryParams )

    // Navigate the sveltekit way.
    await goto( `?${query.toString()}` )
}
</script>

<SketchVariantList
    {url}
    on:sketch-meta={onSketchMeta}
    on:variant-click={gotoSketchVariant2}
/>

{#if meta}
    <pre>{JSON.stringify( meta, null, 2 ) }</pre>
{/if}
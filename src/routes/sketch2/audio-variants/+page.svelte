<script>
import Navigation from "../Navigation.svelte";
import SketchLoader from "../SketchLoader.svelte"
import SketchVariantList from "../SketchVariantList.svelte";
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

<Navigation/>

<ul>
    <li>This audioContext will only run if the user has clicked navigation item. </li>
    <li>will not likely run on refresh in chrome</li>
    <li>option 1) i think this means i need to autoPlay=false by default,so,user clicks to activate the audioContext</li>
    <li>option 2) when displaying a list of audio sketches always display a poster and never play item until after a click</li>
</ul>

<!--<SketchLoader {url} />-->

<SketchVariantList
        {url}
        on:sketch-meta={onSketchMeta}
        on:variant-click={gotoSketchVariant2}
/>

{#if meta}
    <pre>{JSON.stringify( meta, null, 2 ) }</pre>
{/if}
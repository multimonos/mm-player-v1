<script>
import SketchLoader from "../SketchLoader.svelte"

// @todo Reload the script loader without using target="_self"

//vars
let meta
const url = "http://localhost:7770/sketch-draft/sketchv2/color-parameterized.bundle.js"

//fns
const onSketchMeta = e => {
    console.log( e.detail )
    meta = e.detail
}

const urlFor = params => {
    const url = new URL( document.location )

    params.map( p => {
        url.searchParams.set( p.name, p.value )
    } )
    console.log( { url } )
    return url.toString()
}
</script>

<SketchLoader {url} on:sketch-meta={onSketchMeta}/>

{#if meta && meta.variants.length}
    <ul>
        {#each meta.variants as variant }
            <li><a href={urlFor(variant.params)} >{variant.name}</a></li>
        {/each}
    </ul>
{/if}
<script>

import { createEventDispatcher } from "svelte";
import SketchPlayer from "./SketchPlayer.svelte";

//props
export let url
//vars
let meta
const dispatch = createEventDispatcher()
// const url = "http://localhost:7770/sketch-draft/sketchv2/color-parameterized.bundle.js"

//fns
const onSketchMeta = e => {
    console.log( "onSketchMeta()", e.detail )
    meta = e.detail
    dispatch( "sketch-meta", meta )
}

const onVariantClick = params => {
    // Make new query.
    const query = new URLSearchParams( window.document.location.search.toString() )
    Object.keys( params ).map( k => query.set( k, params[k] ) )
    console.log( `onVariantClick().query`, query.toString() )

    // Fire the custom "sketch-params" event.
    const detail = { ...params }
    const event = new CustomEvent( "sketch-params", { detail } )
    window.dispatchEvent( event )

    dispatch( "variant-click", { params } )
}
</script>

<div class="flex flex-col">
    <div>
        <SketchPlayer {url} on:sketch-meta={onSketchMeta}/>
    </div>
    <div>
        {#if meta && meta.variants && meta.variants.length}
            <ul class="ml-2">
                {#each meta.variants as variant }
                    <li class="my-2 mx-0 px-0">
                        <button on:click={()=>onVariantClick(variant.params)}>
                            <span>{variant.name}</span>
                            <span class="ml-8"><small>{JSON.stringify( Object.values(variant.params) )}</small></span>
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>


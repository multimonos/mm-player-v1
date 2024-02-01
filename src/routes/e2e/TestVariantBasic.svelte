<script>
import SketchVariantList from "./com/sketch/SketchVariantList.svelte";
import SketchPlayer from "./com/sketch/SketchPlayer.svelte";
import { sketchurl } from "./test-helper.js";

// @todo Reload the script loader without using target="_self"

//vars
let meta
let variants = []
const url = sketchurl("/sketch-draft/sketchv2/e2e-variant-basic.bundle.js")

const onSketchMeta = e => {
    meta = e.detail
    variants = e.detail.variants
}

</script>

<SketchPlayer {url} on:sketch-meta={onSketchMeta}/>

{#if variants.length}
    <SketchVariantList { variants } selectBy="color"/>
{/if}

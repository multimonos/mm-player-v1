<script>
import SketchVariantList from "./com/sketch/SketchVariantList.svelte";
import SketchPlayer from "./com/sketch/SketchPlayer.svelte";
import { sketchurl } from "./test-helper.js";

const url = sketchurl("/sketch-draft/sketchv2/e2e-variant-audio.bundle.js")

// vars
let meta = {}
let variants = []
// $:variants = meta.variants || []
//fns
const onSketchMeta = e => {
    meta = e.detail
    variants = e.detail.variants || []
}
</script>

<SketchPlayer {url} on:sketch-meta={onSketchMeta}/>

{#if variants.length}
<SketchVariantList {variants} selectBy="audioId"/>
{/if}

<script>
import Navigation from "../Navigation.svelte";
import SketchPlayer from "../SketchPlayer.svelte"

// vars
let meta = {}
const url = "http://localhost:7770/sketch-draft/sketchv2/audio-media-element-single.bundle.js"
</script>

<Navigation/>

<SketchPlayer {url} />
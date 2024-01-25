<script>
import Navigation from "../Navigation.svelte";
import SketchPlayer from "../SketchPlayer.svelte"

// vars
let meta = {}
const url = "http://localhost:7770/sketch-draft/sketchv2/sequences.bundle.js"
</script>

<Navigation/>

<SketchPlayer {url} />
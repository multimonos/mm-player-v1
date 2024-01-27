<script>
import Navigation from "../Navigation.svelte";
import SketchPlayer from "../com/sketch/SketchPlayer.svelte"

// vars
let meta = {}
const url = "http://localhost:7770/sketch-draft/sketchv2/sequences.bundle.js"
</script>

<SketchPlayer {url} />
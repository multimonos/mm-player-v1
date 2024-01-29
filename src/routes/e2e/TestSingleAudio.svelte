<script>
import SketchPlayer from "./com/sketch/SketchPlayer.svelte"

// vars
let meta = {}
const url = "http://localhost:7770/sketch-draft/sketchv2/e2e-single-audio.bundle.js"
</script>

<SketchPlayer {url}/>
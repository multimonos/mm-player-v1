<script>
import SketchPlayer from "./com/sketch/SketchPlayer.svelte"
import { sketchurl } from "./test-helper.js";

const url = sketchurl( "/sketch-draft/sketchv2/e2e-single-audio.bundle.js" )
</script>

<SketchPlayer {url}/>
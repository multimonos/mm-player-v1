<script>
import Navigation from "../Navigation.svelte";
import SketchPlayer from "../SketchPlayer.svelte"

// vars
let meta = {}
const url = "http://localhost:7770/sketch-publish/demo/violet.bundle.js"
</script>

<Navigation/>

<SketchPlayer {url} />
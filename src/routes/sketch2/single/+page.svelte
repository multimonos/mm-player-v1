<script>
import Navigation from "../Navigation.svelte";
import SketchLoader from "../SketchLoader.svelte"

// vars
let meta = {}
const url = "http://localhost:7770/sketch-draft/sketchv2/sequences.bundle.js"
</script>

<Navigation/>

<SketchLoader {url} />
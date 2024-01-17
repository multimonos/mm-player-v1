<script>
import SketchLoader from "../SketchLoader.svelte"

// vars
let meta = {}
const url = "http://localhost:7770/sketch-draft/sketchv2/test1.bundle.js"
</script>

<SketchLoader {url} />
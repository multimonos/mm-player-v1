<script>
import SketchList from "../SketchList.svelte"

let meta
const urls = [
    "http://localhost:7770/sketch-publish/demo/violet.bundle.js",
    "http://localhost:7770/sketch-draft/sketchv2/color-parameterized.bundle.js",
    "http://localhost:7770/sketch-draft/sketchv2/test1.bundle.js",
]

</script>

<SketchList {urls} />
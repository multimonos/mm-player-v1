<script>
import Navigation from "../Navigation.svelte";
import SketchLoader from "../SketchLoader.svelte"

// vars
let meta = {}
const url = "http://localhost:7770/sketch-draft/sketchv2/audio-media-element-single.bundle.js"
</script>

<Navigation/>

<ul>
    <li> This audioContext will only run if the user has clicked navigation item. </li>
    <li>will not likely run on refresh in chrome</li>
</ul>

<SketchLoader {url} />
<script>
import SketchLoader from "./SketchLoader.svelte"


export let data

const onSketchMeta = e =>
    console.log( "sketchLoader.meta", e.detail )
</script>
ohai

<pre>
{JSON.stringify( data, null, 2 )}
</pre>

<SketchLoader
        url={data.url}
        on:sketch-meta={onSketchMeta}
/>
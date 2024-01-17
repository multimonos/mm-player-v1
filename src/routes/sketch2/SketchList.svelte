<script>
import SketchLoader from "./SketchLoader.svelte"


//props
export let urls = []
</script>

{#each urls as url }
    <SketchLoader {url} />
{/each}
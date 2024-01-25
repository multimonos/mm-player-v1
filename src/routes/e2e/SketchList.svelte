<script>
import SketchPlayer from "./SketchPlayer.svelte"

//props
export let urls = []
</script>

{#each urls as url }
    <SketchPlayer {url} />
{/each}
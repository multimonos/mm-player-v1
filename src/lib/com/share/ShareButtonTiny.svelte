<script>
import TinyButton from "$lib/com/button/TinyButton.svelte"
import { share } from "$lib/com/share/sharing.js"


// props
export let shareable
</script>

<TinyButton on:click={()=>share(shareable)} icon="mdi:export-variant">
    <slot/>
</TinyButton>

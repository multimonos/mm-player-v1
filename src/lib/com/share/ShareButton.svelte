<script>
import Icon from "$lib/com/icon/Icon.svelte"
import { share } from "$lib/com/share/sharing.js"


// props
export let shareable
</script>

<button type="button" class="btn btn-circle btn-ghost text-white" on:click={()=>share(shareable)}>
    <Icon icon="mdi:export-variant" size="sm"/>
</button>

<script>
import Button from "$lib/com/button/Button.svelte"
import Icon from "$lib/com/icon/Icon.svelte"
import { share } from "$lib/com/share/sharing.js"


export let shareable
</script>

<Button shape="circle" color="ghost" on:click={()=>share(shareable)}>
    <Icon icon="mdi:export-variant" size="sm"/>
</Button>

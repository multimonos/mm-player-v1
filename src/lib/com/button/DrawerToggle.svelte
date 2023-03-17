<script>
import { toggleDrawer } from "$lib/stores.js"
import Button from "$lib/com/button/Button.svelte"
import Icon from "$lib/com/icon/Icon.svelte"
</script>
<Button tid="queue-btn" shape="circle" on:click={()=>toggleDrawer()} classes="hover:text-primary md:btn-sm">
    <Icon icon="mdi:dots-vertical" size="sm"/>
</Button>

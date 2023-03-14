<script>
import Button from "$lib/com/button/Button.svelte"
import { drawerOpen } from "$lib/stores.js"
import Icon from "$lib/com/icon/Icon.svelte"

// props
export let q = []

// fns
const toggle = () => $drawerOpen = ! $drawerOpen
</script>
<Button tid="queue-btn" shape="circle" on:click={toggle} classes="hover:text-primary">
    <Icon icon="mdi:format-list-text" size="sm"/>
</Button>

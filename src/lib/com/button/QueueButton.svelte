<script>
import {drawerOpen} from "$lib/stores.js"
import { goto } from "$app/navigation.js"
import { route } from "$lib/config/routes.js"
import Icon from "$lib/com/icon/Icon.svelte"

// props
export let q = []

// fns
const toggle = ()=> $drawerOpen = !$drawerOpen
</script>
<button data-tid="queue-btn"
        type="button"
        class="btn btn-circle btn-sm hover:text-accent"
        on:click={toggle}
        class:animate-pulse={q.length===0}>
    <Icon icon="mdi:format-list-text"/>
</button>

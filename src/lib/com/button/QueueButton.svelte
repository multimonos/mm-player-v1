<script>
import { goto } from "$app/navigation.js"
import { route } from "$lib/config/routes.js"
import Icon from "$lib/com/Icon.svelte"

// props
export let q = []
</script>
<button data-tid="queue-btn"
        type="button"
        class="btn btn-circle btn-sm hover:text-accent"
        on:click={() => goto( route( "@queue" ) )}
        class:animate-pulse={q.length===0}>
    <Icon icon="mdi:format-list-text"/>
</button>

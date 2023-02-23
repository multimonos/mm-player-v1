<script>
import { service } from "$lib/state-machine/app-machine.js"
import { goto } from "$app/navigation.js"
import { route } from "$lib/config/routes.js"
import Icon from "$lib/com/Icon.svelte"
</script>
<button data-tid="queue-btn"
        type="button"
        class="btn btn-circle btn-sm "
        on:click={() => goto( route( "@queue" ) )}
        class:animate-pulse={$service.context.q.length===0}>
    <Icon icon="mdi:format-list-text"/>
</button>

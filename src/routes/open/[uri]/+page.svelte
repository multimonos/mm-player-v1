<script>
import { service } from "$lib/state-machine/app-machine.js"
import { QueueReplaceEvent } from "$lib/state-machine/events.js"
import { onMount } from "svelte"

export let data

// @todo offer user a choice to play or queue for later
onMount( () => {
    service.send( { type: QueueReplaceEvent, tracks: data.tracks } )
} )
</script>
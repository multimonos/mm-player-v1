<script>
import { route } from "$lib/config/routes.js"
import { goto } from "$app/navigation.js"
import { service } from "$lib/state-machine/app-machine.js"
import { QueueReplaceEvent } from "$lib/state-machine/events.js"
import { fy } from "$lib/util/string.js"

// com
import AlbumPlayButton from "$lib/com/button/AlbumPlayButton.svelte"

// props
export let data

// fns
const playAlbum = album => e => {
    goto( route( "@debug" ) )

    service.send( { type: QueueReplaceEvent, tracks: [ ...album.tracks ] } )
}
// reactives
$: album = data.album
</script>

<AlbumPlayButton on:click={playAlbum(album)}/>
<pre>{fy( data.album )}</pre>
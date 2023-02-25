<script>
import {service} from "$lib/state-machine/app-machine.js"
import {PauseEvent} from "$lib/state-machine/events.js"
import { goto } from "$app/navigation.js"
import { route } from "$lib/config/routes.js"
// com
import ArtistLinks from "$lib/com/artist/ArtistLinks.svelte"
// props
export let track = null

// fns
const viewAlbum = album => e => {
    // @todo issues to solve here after viewing the album
    service.send({type: PauseEvent})
    goto( route( '@album', album ) )
}
</script>
<div data-tid="now-playing">
    {#if track}
        <div data-tid="now-playing-item" class="flex items-center">
            <div class="block mr-2 rounded">
                <img class="object-cover w-10 h-10" src={track.album.images[0]?.url || '/1.png'}/>
            </div>
            <div>
                <p class="text-sm">{track.name}</p>
                <p class="text-xs text-gray-400"><ArtistLinks link={false} artists={track.album.artists}/></p>
            </div>
        </div>
    {:else}
        <div data-tid="now-playing-empty" class="bg-neutral-focus"></div>
    {/if}
</div>
<script>
import { playFromQueue, queueClear } from "$lib/actions.js"
import {gtmSendPlayTrack} from "$lib/util/gtm.js"
import TinyButton from "$lib/com/button/TinyButton.svelte"
// props
export let queue

// fns
const playTrack = ( index, track ) => e => {
    gtmSendPlayTrack( { track: track.name, album: track.album.name } )
    playFromQueue( index )
}
</script>

<ul class="menu menu-compact flex flex-col p-0 px-4">
    <li></li>
    <li class="menu-title">
        <div class="flex justify-between">
        <span>
            Queue
            {#if queue.length}&mdash; {queue.length}{/if}
        </span>
            {#if queue.length}
                <TinyButton icon="mdi:playlist-remove" on:click={() => queueClear()}>Clear</TinyButton>
            {/if}
        </div>
    </li>
    {#if queue.length > 0}
        {#each queue as track, n}
            <li><span class="flex gap-4" on:click={playTrack(n + 1, track)}>{track.name}</span></li>
        {/each}
    {:else}
        <li><span class="flex gap-4">Nuthin</span></li>
    {/if}
</ul>
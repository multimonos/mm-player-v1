<script>
import { service } from "$lib/state-machine/app-machine.js"
import { QueueReplaceEvent } from "$lib/state-machine/events.js"

// com
import IfDebug from "$lib/com/util/IfDebug.svelte"
import AlbumPlayButton from "$lib/com/button/AlbumPlayButton.svelte"
import AlbumDuration from "$lib/com/album/AlbumDuration.svelte"
import MoreButton from "$lib/com/button/MoreButton.svelte"

// props
export let data

// fns
const playAlbum = album => e =>
    service.send( { type: QueueReplaceEvent, tracks: [ ...album.tracks ] } )

const playTrack = track => e =>
    service.send( { type: QueueReplaceEvent, tracks: [ { ...track } ] } )

// reactives
$: album = data.album
</script>


<div id="album-hero" class="flex flex-col">
    <div class="mx-auto mb-4">
        <img class="object-cover w-36 h-36" src={album.images[0]?.url || '/1.png'}/>
    </div>
    <div class="flex flex-col">
        <h1 class="text-2xl font-bold mb-2">{album.name}</h1>
        <p class="text-xs">
            {album.tracks.length} tracks
            &bull;
            <AlbumDuration {album}/>
        </p>
    </div>
</div>


<div class="flex justify-end">
    <AlbumPlayButton on:click={playAlbum(album)}/>
</div>


{#if album.tracks}
    <div id="album-tracks" class="flex flex-col">
        {#each album.tracks as track, n }
            <div class="flex items-center space-x-2">
                <div class="flex-none p-2">
                    <button class="btn btn-md btn-ghost text-xs" on:click={playTrack(track)}>{n + 1}</button>
                </div>
                <div class="flex-1">
                    <span>{track.name}</span>
                </div>
                <div class="flex-none">
                    <MoreButton/>
                </div>
            </div>
        {/each}
    </div>
{/if}

<IfDebug value={data.album}/>
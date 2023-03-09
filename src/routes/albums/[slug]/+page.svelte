<script>
import { queueManyThenPlay, queueOneThenPlay } from "$lib/actions.js"

// com
import ContentBlock from "$lib/layout/ContentBlock.svelte"
import IfDebug from "$lib/com/util/IfDebug.svelte"
import AlbumPlayButton from "$lib/com/button/AlbumPlayButton.svelte"
import TracksDuration from "$lib/com/track/TracksDuration.svelte"
import MoreButton from "$lib/com/button/MoreButton.svelte"

// props
export let data

// reactives
$: album = data.album
</script>

<ContentBlock>


    <div id="album-hero" class="flex flex-col">
        <div class="mx-auto mb-4">
            <img class="object-cover w-36 h-36" src={album.images[0]?.url || '/1.png'}/>
        </div>
        <div class="flex flex-col">
            <h1 class="text-2xl font-bold mb-2">{album.name}</h1>
            <p class="text-xs">
                {album.tracks.length} tracks
                &bull;
                <TracksDuration tracks={album.tracks}/>
            </p>
        </div>
    </div>


    <div class="flex justify-end">
        <AlbumPlayButton on:click={queueManyThenPlay(album.tracks)}/>
    </div>


    {#if album.tracks}
        <div id="album-tracks" class="flex flex-col space-y-2">
            {#each album.tracks as track, n }
                <div class="flex items-center space-x-2">
                    <div class="flex-none">
                        <button data-tid="play-track-btn" class="btn-circle btn text-xs" on:click={queueOneThenPlay(track)}>{n + 1}</button>
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

</ContentBlock>
<IfDebug value={data.album}/>
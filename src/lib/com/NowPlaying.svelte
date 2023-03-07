<script>
// com
import TracksDuration from "$lib/com/track/TracksDuration.svelte"
// props
export let track = null
</script>
<div data-tid="now-playing">
    {#if track}
        <div data-tid="now-playing-item" class="flex items-center">
            <div class="flex-none hidden sm:block block mr-2 rounded">
                <img class="object-cover w-10 h-10" src={track.album?.images[0]?.url || '/1.png'}/>
            </div>
            <div>
                <p data-tid="current-track-name" class="text-sm w-40 h-5 overflow-hidden whitespace-nowrap text-ellipsis">{track.name}</p>
                <p class="text-xs text-gray-400">
                    <TracksDuration tracks={[track]}/>
                </p>
            </div>
        </div>
    {:else}
        <div data-tid="now-playing-empty" class="bg-neutral-focus"></div>
    {/if}
</div>
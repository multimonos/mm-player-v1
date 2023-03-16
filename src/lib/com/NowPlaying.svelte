<script>
// com
// props
export let track = null
$:trackName = track?.name.length > 26 ? track?.name.slice( 0, 24 ) + '...' : track?.name
</script>
{#if track}
    <div data-tid="now-playing-item" class="flex items-center">
        <div class="hidden mr-2 rounded h-16 w-16 md:flex-none md:block">
            <img class="object-cover w-full h-full" src={track.album?.images[0]?.url || '/1.png'}/>
        </div>
        <div>
            <p data-tid="current-track-name" class="text-sm">
                <span class="md:hidden">{trackName}</span>
                <span class="hidden md:block">{track.name}</span>
            </p>
            <p class="mt-1 text-xs text-gray-500 sm:text-sm">
                {track.album.name}
            </p>
        </div>
    </div>
{:else}
    <div data-tid="now-playing-empty"></div>
{/if}
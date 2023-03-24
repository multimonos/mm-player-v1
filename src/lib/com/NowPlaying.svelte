<script>
// props
export let track = null

// reactives
$:trackName = track?.name.length > 22 ? track?.name.slice( 0, 22 ) + '...' : track?.name
</script>
{#if track}
    <div data-tid="now-playing-item" class="flex items-center" on:click>
        <div class="hidden lg:block mr-3 rounded h-14 w-14">
            <img class="object-cover rounded w-full h-full" src="{track.album.poster.url}?w=100&h=100&auto=format"/>
        </div>
        <div>
            <p data-tid="current-track-name" class="text-sm">
                <span class="lg:hidden">{trackName}</span>
                <span class="hidden lg:flex">{track.name}</span>
            </p>
            <p class="mt-1 text-xs text-gray-500">
                {track.album.name}
            </p>
        </div>
    </div>
{:else}
    <div data-tid="now-playing-empty"></div>
{/if}
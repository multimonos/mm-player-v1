<script>
import { share } from "$lib/com/share/sharing.js"
import { createAlbumShare, createTrackShare } from "$lib/model/share-factory.js"
import ShareButton from "$lib/com/share/ShareButton.svelte"


// props
export let track

// reactives
$:trackEmpty = ! (track && track.id)
</script>

<ul class="menu menu-compact flex flex-col p-0 px-4">
    <li></li>
    <li class="menu-title"><span class:text-primary={!trackEmpty}>Now Playing</span></li>
    {#if trackEmpty}
        <li>
            <span class="flex gap-4">Nothing</span>
        </li>
    {/if}
</ul>
{#if ! trackEmpty}
    <div class="flex flex-col shrink-0 pl-8 pr-0 mt-4 mb-4">
        <div class="flex">
            <div class="aspect-square w-32 rounded">
                <img src={track.album.images?.[0].url} class=" object-cover rounded"/>
            </div>
            <div class="pl-2 flex flex-col items-start gap-4">
                <ShareButton shareable={createTrackShare(track)} classes="text-xs btn-xs" iconSize="xs">
                    <span class="normal-case font-normal">Share track</span>
                </ShareButton>
                <ShareButton shareable={createAlbumShare(track.album)} classes="text-xs btn-xs" iconSize="xs">
                    <span class="normal-case font-normal">Share album</span>
                </ShareButton>
            </div>
        </div>
        <p class="text-sm mt-2">
            <span>{track?.name}</span>
            <br/>
            <span class="text-xs text-gray-500">{track.album.name}</span>
        </p>
    </div>
{/if}

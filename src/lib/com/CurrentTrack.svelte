<script>
import { goto } from "$app/navigation.js"
import { route } from "$lib/config/routes.js"
import { createAlbumShare, createTrackShare } from "$lib/model/share-factory.js"
import { closeDrawer } from "$lib/stores.js"
import { sanityImageUrl } from "$lib/service/sanity-client.js"
//com
import ShareButtonTiny from "$lib/com/share/ShareButtonTiny.svelte"
import TinyButton from "$lib/com/button/TinyButton.svelte"


// props
export let track

// fns
const viewAlbum = album => () => {
    const url = route( '@album', album )
    goto( url )
    closeDrawer()
}
// reactives
$:trackEmpty = ! (track && track.name)
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
        <p class="text-sm mb-4">
            <span>{track?.name}</span>
            <br/>
            <span class="text-xs text-gray-500">{track.album.name}</span>
        </p>
        <div class="flex">
            <div class="aspect-square w-32 rounded">
                <img src={sanityImageUrl(track.album.poster).width(150).height(150).auto('format')} class="object-cover rounded"/>
            </div>
            <div class="pl-4 flex flex-col items-start gap-3">
                <ShareButtonTiny shareable={createTrackShare(track)}>Share track</ShareButtonTiny>
                <ShareButtonTiny shareable={createAlbumShare(track.album)}>Share album</ShareButtonTiny>
                <TinyButton icon="mdi:eye-outline" on:click={viewAlbum(track.album)}>View album</TinyButton>
            </div>
        </div>

    </div>
{/if}

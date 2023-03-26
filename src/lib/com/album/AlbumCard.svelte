<script>
import { goto } from "$app/navigation.js"
import { route } from "$lib/config/routes.js"
import { gtmSendPlayAlbum } from "$lib/util/gtm.js"
import { queueReplaceThenPlay } from "$lib/actions.js"
import { createAlbumShare } from "$lib/model/share-factory.js"
import { sanityImageUrl } from "$lib/service/sanity-client.js"
// com
import AlbumType from "$lib/com/album/AlbumType.svelte"
import ShareButton from "$lib/com/share/ShareButton.svelte"
import PlayAlbumButton from "$lib/com/button/PlayAlbumButton.svelte"
import TracksCount from "$lib/com/track/TracksCount.svelte"
import BackgroundImage from "$lib/com/BackgroundImage.svelte"

// props
export let album
export let onClick = () => goto( route( '@album', album ) )

// fns
const playAlbum = album => () => {
    gtmSendPlayAlbum( { album: album.name } )
    queueReplaceThenPlay( album.tracks )
}

// reactive
$:shareable = createAlbumShare( album )
</script>
{#if album}
    <div class="relative w-full h-full md:drop-shadow">

        <!-- CardLinkOverlay -- pass in prop onClick to override -->
        <a class="z-[4] absolute w-full h-full inset-0 cursor-pointer" href={route('@album', album)} on:click|preventDefault={onClick}></a>

        <!-- CardContentWrapper -->
        <div class="relative flex flex-col h-full justify-between">

            <div class="z-[2] bg-gradient-to-b h-1/2 from-black/40">
                <div class="card-header text-white p-4 flex flex-col">

                    <h3 class="text-2xl mb-1 tracking-wide">
                        <slot name="title">
                            {album.name}
                        </slot>
                    </h3>

                    <slot name="header">
                        <p class="text-xs ">
                            <AlbumType type={album.album_type}/>
                            &bull;
                            <TracksCount tracks={album.tracks}/>
                        </p>
                    </slot>

                </div>

                {#if $$slots.default}
                    <div class="card-content">
                        <slot/>
                    </div>
                {/if}
            </div>

            <!-- CardFooter -->
            <div class="relative z-[6] bg-gradient-to-t from-black/10 flex items-end">
                <div class="z-[6] relative w-full p-1 text-white flex items-center space-x-1 justify-between">
                    <slot name="footer">
                        <PlayAlbumButton on:click={playAlbum(album)}/>
                        <ShareButton {shareable}/>
                    </slot>
                </div>
            </div>
        </div>

        <BackgroundImage url={sanityImageUrl(album.poster).size(1200,1200).auto('format')}/>
    </div>
{/if}

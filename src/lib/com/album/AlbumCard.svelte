<script>
import { goto } from "$app/navigation.js"
import { route } from "$lib/config/routes.js"
import { queueManyThenPlay } from "$lib/actions.js"
import { suffixIf } from "$lib/util/string.js"
import { createAlbumShare } from "$lib/model/share-factory.js"
import AlbumType from "$lib/com/album/AlbumType.svelte"
import ShareButton from "$lib/com/share/ShareButton.svelte"
import PlayAlbumButton from "$lib/com/button/PlayAlbumButton.svelte"

// props
export let album
export let onClick = () => goto( route( '@album', album ) )

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

                    <h3 class="text-2xl mb-1">
                        <slot name="title">
                            {album.name}
                        </slot>
                    </h3>

                    <slot name="header">
                        <p class="text-xs ">
                            <AlbumType type={album.album_type}/>
                            &bull; {album.tracks.length} {suffixIf( album.tracks.length > 1, 'track' )}
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
                        <PlayAlbumButton on:click={queueManyThenPlay(album.tracks)}/>
                        <ShareButton {shareable}/>
                    </slot>
                </div>
            </div>
        </div>

        <!-- CardBackgroundImage -->
        <div class="z-[1] absolute w-full h-full overflow-hidden inset-0 bg-no-repeat bg-cover bg-[50%]">
            <figure class="absolute w-full h-full inset-0 bg-no-repeat bg-cover bg-[50%] bg-transparent" style="background-image: url({album?.images[0]?.url})"/>
        </div>
    </div>
{/if}

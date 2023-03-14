<script>
import { goto } from "$app/navigation.js"
import { route } from "$lib/config/routes.js"
import AlbumType from "$lib/com/album/AlbumType.svelte"
import Button from "$lib/com/button/Button.svelte"
import ShareButton from "$lib/com/share/ShareButton.svelte"
import { queueManyThenPlay } from "$lib/actions.js"
import { suffixIf } from "$lib/util/string.js"
import { createShareable } from "$lib/com/share/sharing.js"

// props
export let album
export let onClick = () => goto( route( '@album', album ) )

$:shareable = createShareable( {
    url: album.links.share,
    image: album.images?.[0].url,
    title:`${album.name} by multimonos`,
} )
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
                <div class="z-[6] relative w-full p-4 text-white flex items-center space-x-1 justify-between">

                    <slot name="footer">
                        <div>
                            <Button shape="circle" color="ghost" kind="outline" size="xs" on:click={queueManyThenPlay(album.tracks)} icon="mdi:play" classes="text-white"/>
                        </div>
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

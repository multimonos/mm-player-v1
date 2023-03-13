<script>
import { route } from "$lib/config/routes.js"
import AlbumType from "$lib/com/album/AlbumType.svelte"
import PlayButton from "$lib/com/transport/button/PlayButton.svelte"
import ShareButton from "$lib/com/button/ShareButton.svelte"
import { queueManyThenPlay} from "$lib/actions.js"

export let album
</script>
{#if album}
    <div class="relative w-full h-full md:drop-shadow group">

        <!-- CardLink-->
        <a class="z-[4] absolute w-full h-full inset-0" href={route('@album', album)}></a>

        <!-- CardContent -->
        <div class="relative flex flex-col h-full justify-between">
            <div class="z-[2] bg-gradient-to-b h-1/2 from-black/20">
                <div class="card-header text-white p-4 flex flex-col">
                    <a class="text-2xl">{album.name}</a>
                    <span class="text-sm uppercase"><AlbumType type={album.album_type}/></span>
                </div>
            </div>


            <!-- CardFooter -->
            <div class="relative z-[6] h-16 bg-gradient-to-t from-black/30 flex items-end">
                <div class="z-[6] relative flex items-center space-x-1 p-4 text-white">
                    <p>hi</p>
                    <p>bye</p>
                    <PlayButton enabled="true" on:click={queueManyThenPlay(album.tracks)}/>
                    <ShareButton enabled="true" on:click={()=>confirm('share?')}/>
                </div>
            </div>
        </div>


        <!-- CardBackgroundImage -->
        <div class="z-[1] absolute w-full h-full overflow-hidden inset-0 bg-no-repeat bg-cover bg-[50%]">
            <figure class="absolute w-full h-full inset-0 bg-no-repeat bg-cover bg-[50%] bg-transparent" style="background-image: url({album?.images[0]?.url})"/>
        </div>
    </div>
{/if}

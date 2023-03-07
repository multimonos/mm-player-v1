<script>
import { route } from "$lib/config/routes.js"

// com
import ArtistLinks from "$lib/com/artist/ArtistLinks.svelte"
import AlbumType from "$lib/com/album/AlbumType.svelte"
import IfDebug from "$lib/com/util/IfDebug.svelte"

// props
export let data
</script>

<div class="flex flex-col space-y-2">

    {#each data.albums as album}
        <a class="flex items-center space-x-4" href={route('@album', album)}>
            <div class="flex-none">
               <img class="object-cover w-16 h-16" alt="{album.name}" src={album.images[0]?.url || '/1.png'}/>
            </div>
            <div class="flex-1">
                <p class="text-md">{album.name}</p>
                <p class="text-sm text-gray-400">
                    <AlbumType type={album.album_type}/>
                </p>
            </div>
        </a>
    {/each}
</div>


<IfDebug value={data.albums}/>
<script>
import { route } from "$lib/config/routes.js"
import ContentBlock from "$lib/layout/ContentBlock.svelte"

// com
import AlbumType from "$lib/com/album/AlbumType.svelte"
import IfDebug from "$lib/com/util/IfDebug.svelte"

// props
export let data
</script>

<ContentBlock>

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

    {#each data.albums as album}
        <div class="card card-side bg-base-100 shadow-xl">
            <figure><img src={album.images[0]?.url} alt={album.name}/></figure>
            <div class="card-body">
                <h2 class="card-title">{album.name}</h2>
                <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec id elit non mi porta gravida at eget metus. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta
                    gravida at eget metus. Maecenas sed diam eget risus varius blandit sit amet non magna. Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
                <div class="card-actions justify-end">
                    <button class="btn btn-primary">watch</button>
                </div>
            </div>
        </div>
    {/each}
</ContentBlock>


<IfDebug value={data.albums}/>
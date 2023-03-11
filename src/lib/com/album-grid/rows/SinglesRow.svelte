<script>
import { arrayPad } from "$lib/com/album-grid/album-grid.js"
import AlbumCard from "$lib/com/album-grid/AlbumCard.svelte"


const count = 3

export let cells

$:items = arrayPad( count, cells )

</script>
<div class="flex h-album-grid-row gap-x-2">
    {#each items as item }
        <div class="w-1/3">
            <AlbumCard album={item}/>
        </div>
    {/each}
</div>

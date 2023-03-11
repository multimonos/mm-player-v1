<script>
import { arrayPad } from "$lib/com/album-grid2/album-grid.js"
import AlbumCard from "$lib/com/album-grid2/AlbumCard.svelte"


const count = 3
export let cells

$:items = arrayPad( count, cells )
</script>

<div class="md:col-span-2 md:row-span-2">
    <AlbumCard album={items[0]}/>
</div>

<div>
    <AlbumCard album={items[1]}/>
</div>

<div>
    <AlbumCard album={items[2]}/>
</div>
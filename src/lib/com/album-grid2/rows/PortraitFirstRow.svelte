<script>
import { arrayPad } from "$lib/com/album-grid2/album-grid.js"
import AlbumCard from "$lib/com/album-grid2/AlbumCard.svelte"


const count = 4
export let cells
console.log( 'pfr', { cells } )
$:items = arrayPad( count, cells )

</script>

<div class="md:row-span-2">
    <AlbumCard album={items[0]}/>
</div>

<div class="md:col-span-2">
    <AlbumCard album={items[1]}/>
</div>

<div>
    <AlbumCard album={items[2]}/>
</div>

<div>
    <AlbumCard album={items[3]}/>
</div>
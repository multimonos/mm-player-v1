<script>
import { arrayPad } from "$lib/com/album-grid/album-grid.js"
import BackgroundImage from "$lib/com/album-grid/cell/BackgroundImage.svelte"
import AlbumCard from "$lib/com/album-grid/AlbumCard.svelte"


const count = 2
export let cells

$:items = arrayPad( count, cells )

</script>
<div class="flex h-album-grid-row gap-x-2">

    <div class="flex-1 w-2/3">
        <AlbumCard album={items[0]}/>
    </div>

    <div class="w-1/3">
        <AlbumCard album={items[1]}/>
    </div>

</div>

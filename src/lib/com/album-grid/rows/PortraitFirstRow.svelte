<script>
import { arrayPad } from "$lib/com/album-grid/album-grid.js"
import AlbumCard from "$lib/com/album-grid/AlbumCard.svelte"


const count = 4
export let cells
console.log('pfr',{cells})
$:items = arrayPad( count, cells )

</script>
<div class="flex h-album-grid-row-2x gap-x-2">

    <div class="flex-1 w-1/3">
        <AlbumCard album={items[0]}/>
    </div>


    <div class="flex-[2] w-2/3 flex flex-col gap-y-2">

        <div class="flex-1">
            <AlbumCard album={items[1]}/>
        </div>

        <div class="flex-1 flex gap-x-2">
            <div class="flex-1">
                <AlbumCard album={items[2]}/>
            </div>
            <div class="flex-1">
                <AlbumCard album={items[3]}/>
            </div>
        </div>
    </div>

</div>
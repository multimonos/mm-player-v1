<script>
import { arrayPad } from "$lib/com/album-grid2/album-grid.js"
import AlbumCard from "$lib/com/album-grid2/AlbumCard.svelte"


const count = 3

export let cells

$:items = arrayPad( count, cells )

</script>
{#each items as album }
    <div>
        <AlbumCard {album}/>
    </div>
{/each}

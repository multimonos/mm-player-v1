<script>
import AlbumCard from "$lib/com/album/AlbumCard.svelte"

// props
export let albums

// grid construction
const classForCell = ( classes, n ) =>
    classes[n % classes.length]

// grid cell classes
const classes = [
    // Landscape first { 0 1 }
    [ 'md:col-span-2', null ],
    // Singles { 2 3 4 }
    [ null, null, null ],
    // Square first { 5 6 7 }
    [ 'md:col-span-2 md:row-span-2', null, null ],
    // Portrait first { 8 9 10 11 }
    [ 'md:row-span-2', 'md:col-span-2', null, null ],
    // Landscape last { 12 13 }
    [ null, 'md:col-span-2' ],
    // Singles { 14 15 16 }
    [ null, null, null ],
    // Square last { 17 18 19 }
    [ null, 'md:col-span-2 md:row-span-2 md:col-start-2', null ],
    // Portrait last { 20 21 22 23 }
    [ 'md:col-span-2', 'md:row-span-2 md:col-start-3', null, null ],
].flat()
</script>

<section class="grid md:grid-cols-3 md:gap-2 auto-rows-viewwidth md:auto-rows-albumgrid">
    {#each albums as album, i}
        <div data-cell={i} class={classForCell(classes,i)}>
            <AlbumCard {album}/>
        </div>
    {/each}
</section>

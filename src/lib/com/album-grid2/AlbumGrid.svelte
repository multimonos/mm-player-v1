<script>
import { chunk } from "lodash"
import { makeRows } from "./album-grid.js"
import LandscapeFirstRow from "$lib/com/album-grid2/rows/LandscapeFirstRow.svelte"
import PortraitFirstRow from "$lib/com/album-grid2/rows/PortraitFirstRow.svelte"
import SquareFirstRow from "$lib/com/album-grid2/rows/SquareFirstRow.svelte"
import SinglesRow from "$lib/com/album-grid2/rows/SinglesRow.svelte"
// create a matrix like grid where
// A = WideAndSingle
// B = Singles
// C = SquareBesideSingleOverSingle
// D = TallBesideWideOverSingleAndSingle
// props
export let albums


console.log( { albums } )
// const

const layout = [
    { cells: 2, component: LandscapeFirstRow },
    { cells: 3, component: SinglesRow },
    { cells: 3, component: SquareFirstRow },
    { cells: 4, component: PortraitFirstRow },
    { cells: 2, component: LandscapeFirstRow },
    { cells: 3, component: SinglesRow },
    { cells: 3, component: SquareFirstRow},
    { cells: 4, component: PortraitFirstRow },
]

const groups = chunk( albums, 24 )
console.log( { groups } )
const rows = groups
    .map( group => makeRows( layout, group ) )
    .flat()
</script>

<section class="md:grid md:grid-cols-3 md:gap-2 md:auto-rows-albumgrid bg-pink-600" >
    {#each rows as row}
        <svelte:component this={row.component} cells={row.data}/>
    {/each}
</section>

<pre>{JSON.stringify( rows, null, 4 )}</pre>

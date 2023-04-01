<script>
/**
 * AlbumHero
 *
 * Mobile - carousel
 * Desktop - grid
 */
import { sanityImageUrl } from "$lib/service/sanity-client.js"
import AlbumType from "$lib/com/album/AlbumType.svelte"
import TracksDuration from "$lib/com/track/TracksDuration.svelte"
import TracksCount from "$lib/com/track/TracksCount.svelte"

// props
export let album

const fakeImages = [
    { url: '/cwm-1.png' },
    { url: '/cwm-2.png' },
    { url: '/cwm-3.png' },
    { url: '/cwm-4.png' },
    { url: '/cwm-5.png' },
]
// album.images = [ ...album.images, ...fakeImages ]
// console.log( album.images )


// grid construction
const classForCell = ( imageCount, n ) => {
    const layouts = {
        1: [ 'md:col-span-3' ],
        2: [ 'md:col-span-2', null ],
        3: [
            // Square first { 5 6 7 }
            [ 'md:col-span-2 md:row-span-2', null, null ],
        ].flat(),
        4: [
            [ 'md:col-span-2', null ],
            [ null, 'md:col-span-2' ],
        ].flat(),
        5: [
            // Landscape first { 0 1 }
            [ 'md:col-span-2', null ],
            // Singles { 2 3 4 }
            [ null, null, null ],
        ].flat(),
    }
    return layouts[imageCount][n % layouts[imageCount].length]
}

// reactive
$:images = [ album.poster, ...album.images ]
</script>
<div id="album-hero--desktop" class="hidden md:relative md:grid md:grid-cols-3 md:gap-2 md:auto-rows-albumhero-md lg:auto-rows-albumhero-lg">
    {#each images as image, i}
        <div data-cell={i} class={classForCell(images.length, i)}>
            <div class="z-[1] relative w-full h-full">
                <figure class="z-[2] absolute w-full h-full inset-0 bg-no-repeat bg-cover bg-[50%] bg-transparent"
                        style="background-image: url({sanityImageUrl(image, {width:1800, height:1800, auto:'format'})})"/>
            </div>
        </div>
    {/each}
    <div class="z-10 absolute top-0">
        <div class="flex flex-col bg-black/50 pl-4 pr-6 py-4 text-white">

            <h1 class="text-4xl tracking-wide mb-2">{album.name}</h1>

            <p class="text-md pl-1">
                <AlbumType type={album.album_type}/>
                &bull;
                <TracksCount tracks={album.tracks}/>
                &bull;
                <TracksDuration tracks={album.tracks}/>
            </p>
        </div>
    </div>
</div>
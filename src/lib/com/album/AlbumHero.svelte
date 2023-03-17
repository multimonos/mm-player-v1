<script>
/**
 * AlbumHero
 *
 * Mobile - carousel
 * Desktop - grid
 */
import { pluralIf } from "$lib/util/string.js"
import AlbumType from "$lib/com/album/AlbumType.svelte"
import TracksDuration from "$lib/com/track/TracksDuration.svelte"
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
        1: ['md:col-span-3'],
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
$:images = [...album.images]
// $:images = [...fakeImages]
</script>

<div id="album-hero--desktop" class="hidden md:relative md:grid md:grid-cols-3 md:gap-2 md:auto-rows-albumhero-md lg:auto-rows-albumhero-lg">
    {#each images as image, i}
        <div data-cell={i} class={classForCell(images.length, i)}>
            <div class="z-[1] relative w-full h-full">
                <figure class="z-[2] absolute w-full h-full inset-0 bg-no-repeat bg-cover bg-[50%] bg-transparent" style="background-image: url({image.url})"/>
            </div>
        </div>
    {/each}
    <div class="z-10 absolute top-0">
        <div class="flex flex-col bg-black/50 pl-4 pr-6 py-4 text-white">

            <h3 class="text-4xl tracking-wide mb-2">{album.name}</h3>

            <p class="text-md pl-1">
                <AlbumType type={album.album_type}/>
                &bull; {album.tracks.length} {pluralIf( album.tracks.length > 1, 'track' )}
                &bull;
                <TracksDuration tracks={album.tracks}/>
            </p>
        </div>
    </div>
</div>

<!--<div id="album-hero&#45;&#45;desktop" class="hidden md:flex">-->

<!--    {#if images.length > 1}-->

<!--    {:else}-->
<!--        &lt;!&ndash; CardBackgroundImage &ndash;&gt;-->
<!--        <div class="z-[1] absolute w-full h-full overflow-hidden inset-0 bg-no-repeat bg-cover bg-[50%]">-->
<!--            <figure class="absolute w-full h-full inset-0 bg-no-repeat bg-cover bg-[50%] bg-transparent" style="background-image: url({album?.images[0]?.url})"/>-->
<!--        </div>-->
<!--    {/if}-->

<!--    <div class="absolute top-0 text-white/90  p-4">-->
<!--        <div class="flex flex-col">-->

<!--        <h3 class="text-2xl mb-1">-->
<!--            {album.name}-->
<!--        </h3>-->

<!--        <p class="text-xs ">-->
<!--            <AlbumType type={album.album_type}/>-->
<!--            &bull; {album.tracks.length} {pluralIf( album.tracks.length > 1, 'track' )}-->
<!--            &bull; <TracksDuration tracks={album.tracks}/>-->
<!--        </p>-->
<!--        </div>-->
<!--    </div>-->
<!--</div>-->

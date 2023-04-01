<script>
/**
 * AlbumHero
 *
 * Mobile - carousel
 * Desktop - grid
 */
import { inView } from "$lib/util/in-view.js"
import { imageUrl } from "$lib/service/sanity-client.js"
//com
import AlbumType from "$lib/com/album/AlbumType.svelte"
import TracksDuration from "$lib/com/track/TracksDuration.svelte"
import BackgroundImage from "$lib/com/BackgroundImage.svelte"
import TracksCount from "$lib/com/track/TracksCount.svelte"

// props
export let album

const fakeImages = [
    { url: '/cwm-1.png' },
    // { url: '/cwm-2.png' },
    // { url: '/cwm-3.png' },
    // { url: '/cwm-4.png' },
    // { url: '/cwm-5.png' },
]

let slide = 'slide0'

const setCurrentSlide = e => {
    slide = e.target.id
}

// reactive
$:images = [ album.poster, ...album.images ]
</script>


<div id="album-hero--mobile" class="relative md:hidden" class:h-[100vw]={images.length===1}>
    {#if images.length > 1}
        <!-- Carousel -->
        <div class="carousel space-x-4 bg-neutral">
            {#each images as image, n}
                <div id="slide{n}" class="carousel-item" use:inView on:inviewEnter={setCurrentSlide}>
                    <img src={imageUrl( image, {width:1200,height:1200,auto:'format'} )} class="h-100vw"/>
                </div>
            {/each}
        </div>

        <div class="bottom-0 flex justify-center w-full py-2 mt-[-2.25rem] space-x-1">
            {#each images as image, n }
                <a class="btn btn-xs btn-circle btn-ghost font-extrabold text-lg" class:opacity-50={`slide${n}`!==slide} class:text-primary={`slide${n}`===slide}>&bull;</a>
            {/each}
        </div>
    {:else}
        <BackgroundImage url={imageUrl(album.poster, {width:1200,height:1200,auto:'format'})}/>
    {/if}

    <div class="z-[2] absolute top-0 text-white/90 p-4">
        <div class="flex flex-col">

            <h1 class="text-2xl mb-1">
                {album.name}
            </h1>

            <p class="text-xs ">
                <AlbumType type={album.album_type}/>
                &bull;
                <TracksCount tracks={album.tracks}/>
                &bull;
                <TracksDuration tracks={album.tracks}/>
            </p>
        </div>
    </div>
</div>

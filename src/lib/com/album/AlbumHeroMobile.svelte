<script>
/**
 * AlbumHero
 *
 * Mobile - carousel
 * Desktop - grid
 */
import { inView } from "$lib/util/in-view.js"
import { pluralIf } from "$lib/util/string.js"
import AlbumType from "$lib/com/album/AlbumType.svelte"
import TracksDuration from "$lib/com/track/TracksDuration.svelte"

// props
export let album

const images = [
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
</script>


<div id="album-hero--mobile" class="relative h-100vw md:hidden">
    {#if album.images.length > 1}
        <!-- Carousel -->
        <div class="carousel space-x-4 bg-neutral">
            {#each album.images as image, n}
                <div id="slide{n}" class="carousel-item" use:inView on:inviewEnter={setCurrentSlide}>
                    <img src={image.url} class="h-100vw"/>
                </div>
            {/each}
        </div>

        <div class="absolute bottom-1 flex justify-center w-full py-2 space-x-1">
            {#each album.images as image, n }
                <a class="btn btn-xs btn-circle btn-ghost font-extrabold text-lg" class:opacity-50={`slide${n}`!==slide} class:text-primary={`slide${n}`===slide}>&bull;</a>
            {/each}
        </div>
    {:else}
        <!-- CardBackgroundImage -->
        <div class="z-[1] absolute w-full h-full overflow-hidden inset-0 bg-no-repeat bg-cover bg-[50%]">
            <figure class="absolute w-full h-full inset-0 bg-no-repeat bg-cover bg-[50%] bg-transparent" style="background-image: url({album?.images[0]?.url})"/>
        </div>
    {/if}

    <div class="z-[2] absolute top-0 text-white/90 p-4">
        <div class="flex flex-col">

            <h3 class="text-2xl mb-1">
                {album.name}
            </h3>

            <p class="text-xs ">
                <AlbumType type={album.album_type}/>
                &bull; {album.tracks.length} {pluralIf( album.tracks.length > 1, 'track' )}
                &bull;
                <TracksDuration tracks={album.tracks}/>
            </p>
        </div>
    </div>
</div>

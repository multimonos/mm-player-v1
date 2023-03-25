<script>
import BackgroundImage from "$lib/com/BackgroundImage.svelte"
import BackgroundMask from "$lib/com/BackgroundMask.svelte"
import { isSanityImage, sanityImageUrl } from "$lib/service/sanity-client.js"


export let eyebrow
export let title
export let tagline
export let image = null // null | string | SanityImageAsset


$:url = isSanityImage( image )
    ? sanityImageUrl( image ).width( 1800 ).height( 1800 ).auto( 'format' )
    : image

</script>
<section class="relative h-100vw md:h-[40vw] mb-2 lg:mb-3">
    <div class="z-10 relative h-full flex flex-col justify-between text-white pt-20 md:pt-10 lg:pt-20 p-4 md:p-16">
        <div>
            {#if eyebrow}<h3 class="uppercase text-sm text-white/70">{eyebrow}</h3>{/if}
            <h2 class="text-5xl font-bold tracking-wide uppercase mb-2 md:text-4xl lg:text-7xl ">{@html title}</h2>
            {#if tagline}<p class="text-xl font-light md:text-3xl md:max-w-3xl">{tagline}</p>{/if}
        </div>

        {#if $$slots.cta}
            <div class="flex justify-end">
                <slot name="cta"></slot>
            </div>
        {/if}
    </div>

    {#if url}
        <BackgroundImage {url}/>
        <BackgroundMask gradient="bg-gradient-to-b from-red-800" opacity="opacity-30"/>
    {/if}
</section>

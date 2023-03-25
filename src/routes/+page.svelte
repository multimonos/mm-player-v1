<script>
import Contained from "$lib/layout/Contained.svelte"
import AlbumGrid from "$lib/com/album/AlbumGrid.svelte"
import MetaTags from "$lib/com/seo/MetaTags.svelte"
import ContentEnd from "$lib/layout/ContentEnd.svelte"
import Hero from "$lib/com/Hero.svelte"
import BackgroundMask from "$lib/com/BackgroundMask.svelte"
import BackgroundImage from "$lib/com/BackgroundImage.svelte"

// console.clear()
export let data

const test = new Array( 30 )
    .fill( null )
    .map( ( v, i ) => i )


$:albums = data.albums
</script>

<MetaTags tags={data.meta}/>

<Contained>
    {#if data.content.hero}
        <Hero eyebrow={data.content.hero.eyebrow}
              title={data.content.hero.title}
              tagline={data.content.hero.tagline}>
            <div slot="background">
                {#if data.content.hero.image.url}
                     <BackgroundImage url={data.content.hero.image.url}/>
                {/if}
                <BackgroundMask gradient="bg-gradient-to-b from-red-800" opacity="opacity-30"/>
            </div>
        </Hero>
    {/if}

    <AlbumGrid albums={albums}/>

</Contained>

<ContentEnd/>
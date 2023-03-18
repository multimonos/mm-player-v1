<script>
import Contained from "$lib/layout/Contained.svelte"
import AlbumGrid from "$lib/com/album/AlbumGrid.svelte"
import MetaTags from "$lib/com/seo/MetaTags.svelte"
import ContentEnd from "$lib/layout/ContentEnd.svelte"
import Hero from "$lib/com/Hero.svelte"
import BackgroundImage from "$lib/com/BackgroundImage.svelte"
import BackgroundMask from "$lib/com/BackgroundMask.svelte"

// console.clear()
export let data

const test = new Array( 30 )
    .fill( null )
    .map( ( v, i ) => i )


$:albums = data.albums
</script>

<MetaTags tags={data.meta}/>

<Contained>
    <Hero eyebrow="Sollicitudin Etiam"
          tagline="multimonos is a collection of audio and data impressions crafted in the spirit of slow media"
          title="Numerical<br/>Love">
        <div slot="background">
            <BackgroundImage url="/cwm-1.png"/>
            <BackgroundMask gradient="bg-gradient-to-b from-red-800" opacity="opacity-30"/>
        </div>
    </Hero>

    <AlbumGrid albums={albums}/>

</Contained>

<ContentEnd/>
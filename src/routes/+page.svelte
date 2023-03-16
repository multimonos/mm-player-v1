<script>
import Contained from "$lib/layout/Contained.svelte"
import AlbumGrid from "$lib/com/album/AlbumGrid.svelte"
import MetaTags from "$lib/com/seo/MetaTags.svelte"
import ContentEnd from "$lib/layout/ContentEnd.svelte"

// console.clear()
export let data

const test = new Array( 30 )
    .fill( null )
    .map( ( v, i ) => i )


$:albums = data.albums
</script>

<MetaTags tags={data.meta}/>

<Contained>
    <AlbumGrid albums={albums}/>
</Contained>

<ContentEnd/>
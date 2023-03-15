<script>
import Contained from "$lib/layout/Contained.svelte"
import AlbumGrid from "$lib/com/album/AlbumGrid.svelte"
import MetaTags from "$lib/com/seo/MetaTags.svelte"


// console.clear()
export let data

const test = new Array( 30 )
    .fill( null )
    .map( ( v, i ) => i )


const albums = data.albums
// const albums = test
// console.log( 'layout', layout )
// console.log(albums)

</script>
<MetaTags tags={data.meta}/>
<!--<ContentBlock>-->


<!--</ContentBlock>-->
<Contained>
    <AlbumGrid albums={albums}/>
</Contained>
<br>
<br>
<br>

<script>
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
<div class="md:container md:mx-auto">
    <AlbumGrid albums={albums}/>
</div>
<br>
<br>
<br>

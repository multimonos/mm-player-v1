<script>
import ContentBlock from "$lib/layout/ContentBlock.svelte"
import AlbumGrid from "$lib/com/album-grid/AlbumGrid.svelte"


// console.clear()
export let data

const test = new Array( 30 )
    .fill( null )
    .map( ( v, i ) => i )


const albums = data.albums.map((a,i)=>({...a,id:i}))
// const albums = test
// console.log( 'layout', layout )
// console.log(albums)

</script>
<ContentBlock>

    <AlbumGrid albums={albums}/>



</ContentBlock>

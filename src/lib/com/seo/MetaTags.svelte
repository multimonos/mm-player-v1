<script>
// @see https://jsonld.com/web-page/

export let tags =[]

$:items = tags ? tags.filter( t => t.name !== 'title' ) :[]
$:title = tags ? tags.find( t => t.name === 'title' ) ?? '' :''
</script>
<svelte:head>
    <title>{title?.content}</title>
    {#each items as props }
        <meta {...props}/>
    {/each}
</svelte:head>
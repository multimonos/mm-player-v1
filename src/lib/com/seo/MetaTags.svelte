<script>
// @see https://jsonld.com/web-page/

export let tags = {}

$:items = tags.filter( t => t.name !== 'title' )
$:title = tags.find( t => t.name === 'title' )
</script>

<svelte:head>
    <title>{title?.content}</title>
    {#each items as props }
        <meta {...props}/>
    {/each}
</svelte:head>
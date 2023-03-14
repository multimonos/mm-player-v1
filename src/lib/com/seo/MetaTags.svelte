<script>
// @see https://jsonld.com/web-page/
import { site } from "$lib/config/site.js"


export let title
export let tags = []

const has = ( name, tags ) =>
    tags.find( t => t.name === name )


if ( ! has( 'author', tags ) )
    tags = [ ...tags, { name: 'author', value: site.author } ]

if ( ! has( 'keywords', tags ) )
    tags = [ ...tags, { name: 'keywords', value: site.keywords } ]

if ( ! has( 'description', tags ) )
    tags = [ ...tags, { name: 'description', value: site.description } ]

$:items = tags.filter( t => t.name !== 'title' )
$:title = tags.find( t => t.name === 'title' )
</script>

<svelte:head>
    <title>{title?.value}</title>
    {#each items as { name, value }}
        <meta {name} content={value}/>
    {/each}
</svelte:head>
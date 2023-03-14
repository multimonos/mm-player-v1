<script>
// import { site } from "$lib/config/site.js"
export let tags = {}
export let debug =false
</script>

{#if debug}
    <pre>{JSON.stringify( tags, null, 2 )}</pre>
{/if}
<svelte:head>
    {#each tags as { name, value }}
        <meta property={name} content={value}/>
    {/each}
</svelte:head>
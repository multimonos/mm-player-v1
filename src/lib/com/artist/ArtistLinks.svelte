<script>
    import { route } from "$lib/config/routes.js"
    import { commaIf } from "$lib/util/string.js"

    // props
    export let artists = []
</script>
{#if artists.length}
    {#each artists as artist, i}
        <a href="{route('@artist', artist)}" class="hover:underline">{artist.id}</a>{commaIf( i < artists.length - 1 )}
    {/each}
{/if}
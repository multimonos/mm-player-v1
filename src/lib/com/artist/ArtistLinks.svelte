<script>
import { route } from "$lib/config/routes.js"
import { commaIf } from "$lib/util/string.js"

// props
export let artists = []
export let link = true
</script>
{#if artists.length}
    {#each artists as artist, i}
        {#if link}<a href="{route('@artist', artist)}" class="hover:underline">{artist.id}</a>{commaIf( i < artists.length - 1 )}
        {:else}<span>{artist.id}</span>{commaIf( i < artists.length - 1 )}
        {/if}
    {/each}
{/if}
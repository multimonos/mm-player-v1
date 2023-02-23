<script>
import { route } from "$lib/config/routes.js"


export let data
</script>

{#each data.albums as album}
    <p><a href={route("@album", album)}>{album.name}</a></p>
{/each}

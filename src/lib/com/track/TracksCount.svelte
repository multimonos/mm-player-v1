<script>
import pluralize from "pluralize-esm"


export let tracks
</script>
{#if tracks && tracks.length > 0}
    {tracks.length} {pluralize( 'track', tracks.length )}
{/if}
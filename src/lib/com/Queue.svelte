<script>
    export let tracks = []
</script>
<ul data-cy="queue" class="list-none">
    {#if tracks.length > 0}
        {#each tracks as track}
            <li data-cy="queue-item">{track.name}</li>
        {/each}
    {:else}
        <li data-cy="queue-empty">.</li>
    {/if}
</ul>
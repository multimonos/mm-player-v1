<script>
    export let tracks = []
</script>
<ul data-cy="history" class="list-none">
    {#if tracks.length > 0}
        {#each tracks as track}
            <li data-cy="history-item">{track.name}</li>
        {/each}
    {:else}
        <li data-cy="history-empty">.</li>
    {/if}
</ul>
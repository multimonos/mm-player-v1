<script>
    export let tracks = []
</script>
<ul data-tid="history" class="list-none">
    {#if tracks.length > 0}
        {#each tracks as track}
            <li data-tid="history-item">{track.name}</li>
        {/each}
    {:else}
        <li data-tid="history-empty">.</li>
    {/if}
</ul>
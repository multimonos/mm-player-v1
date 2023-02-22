<script>
    export let tracks = []
</script>
<ul data-tid="queue" class="list-none">
    {#if tracks.length > 0}
        {#each tracks as track}
            <li data-tid="queue-item">{track.name}</li>
        {/each}
    {:else}
        <li data-tid="queue-empty">.</li>
    {/if}
</ul>
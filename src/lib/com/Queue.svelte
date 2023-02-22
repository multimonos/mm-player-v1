<script>
    export let tracks = []
</script>
<div data-tid="queue" class="flex flex-col">
    {#if tracks.length > 0}
        {#each tracks as track}
            <div data-tid="queue-item">{track.name}</div>
        {/each}
    {:else}
        <div data-tid="queue-empty">.</div>
    {/if}
</div>
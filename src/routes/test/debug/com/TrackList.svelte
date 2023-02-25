<script>
export let tracks = []
</script>
<div class="flex flex-col">
    {#if tracks.length > 0}
        {#each tracks as track}
            <div>{track.name}</div>
        {/each}
    {:else}
        <div>.</div>
    {/if}
</div>
<script>
    export let track = null
</script>
<ul data-cy="now-playing" class="list-none">
    {#if track}
        <li data-cy="now-playing-item">{track.name}</li>
    {:else}
        <li data-cy="now-playing-empty">.</li>
    {/if}
</ul>
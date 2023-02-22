<script>
    export let track = null
</script>
<ul data-tid="now-playing" class="list-none">
    {#if track}
        <li data-tid="now-playing-item">{track.name}</li>
    {:else}
        <li data-tid="now-playing-empty">.</li>
    {/if}
</ul>
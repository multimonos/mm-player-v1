<script>
export let queue
</script>

<ul class="menu menu-compact flex flex-col p-0 px-4">
    <li></li>
    <li class="menu-title"><span>Queue</span></li>
    {#if queue.length > 0}
        {#each queue as track}
            <li><span class="flex gap-4">{track.name}</span></li>
        {/each}
    {:else}
        <li><span class="flex gap-4">Empty</span></li>
    {/if}
</ul>
<script>
import { queueClear, playFromQueue } from "$lib/actions.js"
import TinyButton from "$lib/com/button/TinyButton.svelte"
// props
export let queue
</script>

<ul class="menu menu-compact flex flex-col p-0 px-4">
    <li></li>
    <li class="menu-title">
        <div class="flex justify-between">
        <span>
            Queue
            {#if queue.length}&mdash; {queue.length}{/if}
        </span>
            {#if queue.length}
                <TinyButton icon="mdi:playlist-remove" on:click={() => queueClear()}>Clear</TinyButton>
            {/if}
        </div>
    </li>
    {#if queue.length > 0}
        {#each queue as track, n}
            <li><span class="flex gap-4" on:click={() => playFromQueue(n+1)}>{track.name}</span></li>
        {/each}
    {:else}
        <li><span class="flex gap-4">Nuthin</span></li>
    {/if}
</ul>
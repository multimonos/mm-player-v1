<script>
import { service } from "$lib/state-machine/app-machine.js"


export let tracks = []

$:q = $service.context.q.slice(1)
</script>

{#if $service.context.track}
    <ul class="menu menu-compact flex flex-col p-0 px-4">
        <li></li>
        <li class="menu-title">
            <span>Now Playing</span>
        </li>
        {#if $service.context.track?.name}
            <li><span class="flex gap-4">{$service.context.track?.name}</span></li>
        {:else}
            <li><span class="flex gap-4">...nothing :(</span></li>
        {/if}
    </ul>
{/if}
<ul class="menu menu-compact flex flex-col p-0 px-4">
    <li></li>
    <li class="menu-title"><span>Queue</span></li>
    {#if q.length > 0}
        {#each q as track}
            <li><span class="flex gap-4">{track.name}</span></li>
        {/each}
    {:else}
        <li><span class="flex gap-4">...nothing :(</span></li>
    {/if}
</ul>
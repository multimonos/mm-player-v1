<script>
import { service } from "$lib/state-machine/app-machine.js"
</script>

    <ul class="menu menu-compact flex flex-col p-0 px-4">
        <li></li>
        <li class="menu-title">
            <span>Now Playing</span>
        </li>
        {#if $service.context.track}
        {#if $service.context.track?.name}
            <li><span class="flex gap-4">{$service.context.track?.name}</span></li>
        {:else}
            <li><span class="flex gap-4">Nothing</span></li>
        {/if}
        {/if}
    </ul>

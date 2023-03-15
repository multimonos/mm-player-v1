<script>
import { service } from "$lib/state-machine/app-machine.js"
// import DebugToggle from "$lib/com/button/DebugToggle.svelte"
import Contained from "$lib/layout/Contained.svelte"
</script>
<nav class="navbar ">
    <Contained>
        <div class="flex-none">
            <label for="my-drawer" class="btn drawer-button pl-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </label>
        </div>
        <div class="flex-1">
            <div class="flex items-center">
                <a href="/" class="font-normal text-md">multimonos</a>

<!--                <kbd class="kbd text-xs ml-2">{$service.value.player} | {$service.context.audioContext?.state}</kbd>-->
<!--                <DebugToggle/>-->

            </div>
        </div>
        <div class="flex-none">
            <!-- more -->
        </div>
    </Contained>
</nav>

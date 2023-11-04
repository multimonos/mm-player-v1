<script>
import {service} from "$lib/state-machine/app-machine.js"
// import DebugToggle from "$lib/com/button/DebugToggle.svelte"
</script>
<div class="sticky top-0 z-30 flex h-16 w-full backdrop-blur transition-all duration-100 text-base-content border-b-[1px] border-white/10" class:hidden={false}>
    <div class="md:container md:mx-auto w-full">
        <nav class="navbar">
            <label for="my-drawer" class="drawer-button btn-square btn-xs btn mr-4 cursor-pointer hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </label>

            <div class="flex-1">
                <div class="flex items-center">
                    <a href="/" class="font-normal text-md hover:text-primary">multimonos</a>
                   <span class="font-mono ml-2">{$service.value.player} / {$service.context?.audioContext?.state}</span>
                </div>
            </div>

            <div> <!-- placeholder --> </div>
        </nav>
    </div>
</div>

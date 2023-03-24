<script>
import { service } from "$lib/state-machine/app-machine.js"
import { closeDrawer } from "$lib/stores.js"

import PrimaryNavigation from "$lib/com/PrimaryNavigation.svelte"
import Queue from "$lib/com/Queue.svelte"
import CurrentTrack from "$lib/com/CurrentTrack.svelte"
</script>
<aside class="bg-base-200 w-80 overflow-y-scroll">
    <div class="h-4"></div>

    <!-- DrawerContent -->

    <PrimaryNavigation on:click={()=>closeDrawer()}/>

    <CurrentTrack track={$service.context.track}/>

    <Queue queue={$service.context.q.slice(1)}/>

    <!-- /DrawerContent -->

    <ul class="menu menu-compact flex flex-col p-0 px-4"></ul>
    <div class="from-base-200 pointer-events-none sticky bottom-0 flex h-20 bg-gradient-to-t to-transparent"></div>
</aside>
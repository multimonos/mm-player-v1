<script>
/**
 * !!! keep layout at this level if possible !!!
 */
import "../app.css"
import { afterNavigate } from "$app/navigation.js"
import { drawerOpen } from "$lib/stores.js"
import { service } from "$lib/state-machine/app-machine.js"
// com
import Footer from "$lib/layout/Footer.svelte"
import Toasts from "$lib/com/Toasts.svelte"
import Navbar from "$lib/layout/Navbar.svelte"
import ServiceTest from "$lib/com/util/ServiceTest.svelte"
import PrimaryNavigation from "$lib/layout/PrimaryNavigation.svelte"
import Queue from "$lib/com/Queue.svelte"


afterNavigate( () => {
    setTimeout( () => { // scroll fix
        document.querySelector( "#main" ).scrollTo( 0, 0 )
    }, 0 )
} )
</script>

<div class="drawer">

    <input id="my-drawer" type="checkbox" class="drawer-toggle" bind:checked={$drawerOpen}/>

    <div class="drawer-content flex flex-col">

        <Navbar/>

        <main id="main" class="overflow-y-auto" style="height: calc(100% - 8rem)"><!-- used to be h-full -->
            <slot/>
        </main>

        <Footer/>

    </div>

    <div class="drawer-side">
        <label for="my-drawer" class="drawer-overlay"></label>
        <aside class="bg-base-200 w-80 overflow-y-scroll">
            <div class="h-4"></div>
            <PrimaryNavigation on:click={()=>$drawerOpen=false}/>
            <Queue/>
            <ul class="menu menu-compact flex flex-col p-0 px-4"></ul>
            <div class="from-base-200 pointer-events-none sticky bottom-0 flex h-20 bg-gradient-to-t to-transparent"></div>
        </aside>
    </div>

</div>

<Toasts toasts={$service.context.toasts}/>

<ServiceTest svc={$service}/>

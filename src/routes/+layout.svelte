<script>
/**
 * !!! keep layout at this level if possible !!!
 */
import "../app.css"
import { drawerOpen } from "$lib/stores.js"
import {service} from "$lib/state-machine/app-machine.js"
// com
import PrimaryNavigation from "$lib/layout/PrimaryNavigation.svelte"
import Footer from "$lib/layout/Footer.svelte"
import Toasts from "$lib/com/Toasts.svelte"
import Navbar from "$lib/layout/Navbar.svelte"
</script>

<div class="drawer">


    <input id="my-drawer" type="checkbox" class="drawer-toggle" bind:checked={$drawerOpen}/>

    <div class="drawer-content">

        <Navbar/>

        <main class="overflow-y-auto h-screen pb-32">
            <slot/>
        </main>

        <Footer/>

    </div>

    <aside class="drawer-side">
        <label for="my-drawer" class="drawer-overlay"></label>
        <PrimaryNavigation on:click={()=>$drawerOpen=false}/>
    </aside>

</div>

<Toasts toasts={$service.context.toasts}/>

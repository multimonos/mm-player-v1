<script>
/**
 * !!! keep layout at this level if possible !!!
 */
import "../app.css"
import { onMount } from "svelte"
import { afterNavigate } from "$app/navigation.js"
import { drawerOpen } from "$lib/stores.js"
import { service } from "$lib/state-machine/app-machine.js"
import { websiteSchema } from "$lib/config/schema-org.js"
// com
import Footer from "$lib/layout/Footer.svelte"
import Toasts from "$lib/com/Toasts.svelte"
import Navbar from "$lib/layout/Navbar.svelte"
import ServiceTest from "$lib/com/util/ServiceTest.svelte"
import PrimaryNavigation from "$lib/layout/PrimaryNavigation.svelte"
import Queue from "$lib/com/Queue.svelte"
import ShareModal from "$lib/com/share/ShareModal.svelte"
import SchemaOrg from "$lib/com/seo/SchemaOrg.svelte"


afterNavigate( () => {
    // scroll to top fix for daisyui drawer
    document.querySelector( '.drawer-content' ).scrollTo( { top: 0, behavior: "smooth" } )
} )

onMount( () => {
    window.service = service
} )
</script>


<div class="drawer">

    <input id="my-drawer" type="checkbox" class="drawer-toggle" bind:checked={$drawerOpen}/>

    <div class="drawer-content">
        <div class="sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 bg-base-100 text-base-content border-b-[1px] border-white/10">
            <Navbar/>
        </div>

        <main id="main" style="height: calc(100% - 8rem)"><!-- used to be h-full -->
            <slot/>
        </main>
    </div>


    <div class="drawer-side">

        <label for="my-drawer" class="drawer-overlay"></label>

        <aside class="bg-base-200 w-80 overflow-y-scroll">
            <div class="h-4"></div>

            <PrimaryNavigation on:click={()=>$drawerOpen=false}/>

            <div class="kbd">@todo info about current album</div>

            <Queue/>

            <ul class="menu menu-compact flex flex-col p-0 px-4"></ul>
            <div class="from-base-200 pointer-events-none sticky bottom-0 flex h-20 bg-gradient-to-t to-transparent"></div>
        </aside>
    </div>

</div>

<Footer/>

<ShareModal/>

<Toasts toasts={$service.context.toasts}/>

<ServiceTest svc={$service}/>

<SchemaOrg schema={websiteSchema}/>
<br><br><br><br>
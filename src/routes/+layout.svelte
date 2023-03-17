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
import ShareModal from "$lib/com/share/ShareModal.svelte"
import SchemaOrg from "$lib/com/seo/SchemaOrg.svelte"
import Drawer from "$lib/layout/Drawer.svelte"


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
        <Navbar/>

        <main id="main" style="height: calc(100% - 8rem)"><!-- used to be h-full -->
            <slot/>
        </main>
    </div>

    <div class="drawer-side">
        <label for="my-drawer" class="drawer-overlay"></label>
        <Drawer/>
    </div>

</div>

<Footer/>

<ShareModal/>
<Toasts toasts={$service.context.toasts}/>
<ServiceTest svc={$service}/>
<SchemaOrg schema={websiteSchema}/>
<!-- no spaces after this or double scroll -->

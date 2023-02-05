<script>
    import "../app.css"
   // import { inspect } from "@xstate/inspect"
    import { onMount } from "svelte"
    // import{service} from "./xstate/state-service.js"


    onMount(()=>{

        // inspect({iframe:false})
        // window.service = service
        // service.start()
    })

</script>

<div class="container mx-auto h-screen">
<slot/>
</div>
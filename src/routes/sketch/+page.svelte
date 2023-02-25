<script>
import { onDestroy, onMount } from "svelte"
import { RenderableTag } from "$lib/state-machine/tags.js"
import { CancelEvent } from "$lib/state-machine/events.js"
import { service } from "$lib/state-machine/app-machine.js"
import P5jsMedia from "$lib/com/media/P5jsMedia.svelte"
import {sketch} from "./sketch.js"

// com


onMount( () => {
    service.send( { type: CancelEvent } )
    console.log( '@sketch mounted' )
} )

onDestroy( () => {
    // service.send( { type: CancelEvent } )
    console.log( '@sketch destroyed' )
} )
</script>
<!--{#if ($service.hasTag( RenderableTag )) && $service.context.media?.component}-->
    <div class="h-full flex flex-col justify-center items-center overflow-x-hidden overflow-y-clip bg-info/30">
        <P5jsMedia {sketch}/>
    </div>
<!--{/if}-->
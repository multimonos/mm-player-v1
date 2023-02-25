<script>
import { onDestroy, onMount } from "svelte"
import { RenderableTag } from "$lib/state-machine/tags.js"
import { CancelEvent } from "$lib/state-machine/events.js"
import { service } from "$lib/state-machine/app-machine.js"

// com
import Media from "$lib/com/media/Media.svelte"

onMount( () => {
    console.log( '@player mounted' )
} )

onDestroy( () => {
    service.send( { type: CancelEvent } )
    console.log( '@player destroyed' )
} )
</script>
{#if ($service.hasTag( RenderableTag )) && $service.context.media?.component}
    <div class="h-full flex flex-col justify-center items-center overflow-x-hidden overflow-y-clip bg-info/30">
        <Media component={$service.context.media.component} props={$service.context.media.componentProps}/>
    </div>
{/if}
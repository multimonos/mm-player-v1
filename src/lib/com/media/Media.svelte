<script>
    // This component just defines an interface that is used to load a Media* component.
    //
    // It really only exists to ensure that the EvolveMediaEvent is sent to the service
    // in a simple consistent way.
    ////////////////////
    import { service } from "$lib/state-machine/app-machine.js"
    import { EvolveMediaEvent } from "$lib/state-machine/events.js"

    // props
    export let component
    export let props

    // fns
    const evolveMedia = e =>
        service.send( { type: EvolveMediaEvent, ref: e.detail } )
</script>

<svelte:component this={component} {...props} on:created={evolveMedia}/>
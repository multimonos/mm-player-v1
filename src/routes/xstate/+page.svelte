<script>
    import { onMount } from "svelte"
    import { appMachine, e } from "$lib/state/app-machine.js"
    import { useMachine } from "@xstate/svelte"
    import { v4 as uuidv4 } from "uuid"


    console.clear()

    const { state, send, service } = useMachine( appMachine )

    service.subscribe( s => {
        console.log( 'state', s.value, s.context, s )
    } )

    //helpers
    const uid = () => uuidv4().split( '-' )[0]
    const fy = o => JSON.stringify( o, ( key, value ) => value === null ? "null" : value, 2 )
    const createTrack = ( { id = uid(), name, duration = 3000 } ) => ({ name, duration, id })
    const track = createTrack( { name: 'foobar', duration: 3000 } )
    const fakeTracks = count => new Array( count ).fill( null ).map( ( v, name ) => createTrack( { name: name + 1, duration: 1000 * Math.floor( Math.random() * 5 ) } ) )

    console.log( fakeTracks( 5 ) )

    // handlers
    const play = () => service.send( { type: e.PLAY } )
    const pause = () => service.send( { type: e.PAUSE } )
    const resume = () => service.send( { type: e.RESUME } )
    const queueAlbum = () => service.send( { type: e.QUEUE, detail: { tracks: fakeTracks( 5 ) } } )
    const queueTrack = () => service.send( { type: e.QUEUE, detail: { tracks: fakeTracks( 1 ) } } )
    const progress = value => () => service.send( { type: e.PROGRESS, detail: { value } } )
    const notifyLoaded = () => service.send( { type: e.LOADED, detail: { track } } )
    const notifyComplete = () => service.send( { type: e.LOADED } )
    const toggleAutoplay = () => service.send( { type: "AUTOPLAY_TOGGLE" } )
    const toggleFullscreen = () => service.send( { type: "FULLSCREEN_TOGGLE" } )

    // notes
    ////////////////////
    // only thing happening in an EvenHandler is to send an Event

    onMount( () => {
        window.service = service
        // inspect( { iframe: false } )
    } )


</script>

<br>
<section class="my-4 p-2 bg-neutral">
    <div class="stats shadow">
        <div class="stat">
            <div class="stat-title uppercase">state</div>
            <div class="stat-value">{$service.value}</div>
        </div>
    </div>
</section>

<section class="grid grid-cols-2 space-x-2 bg-neutral">
    <div class="flex flex-col space-y-4">
        <p class="text-xl uppercase">transport</p>
        <button class="btn btn-accent" on:click={play} disabled={!$service.can(e.PLAY)}>play</button>
        <button class="btn btn-accent" on:click={resume} disabled={!$service.can(e.RESUME)}>resume</button>
        <button class="btn btn-accent" on:click={pause} disabled={!$service.can(e.PAUSE)}>pause</button>
        <button class="btn btn-accent" disabled={!$service.matches("loading")}>
            <div class="radial-progress text-primary text-center" class:animate-spin={$service.matches('loading')} style="--value:90; --size:1rem"></div>
        </button>
    </div>

    <div class="flex flex-col space-y-4">
        <p class="text-xl uppercase">events</p>
        <button class="btn btn-secondary" on:click={queueAlbum}>queue -- album ( replace )</button>
        <button class="btn btn-secondary" on:click={queueTrack}>queue -- track ( append )</button>
        <button class="btn btn-secondary" on:click={notifyLoaded}>loaded</button>
        <button class="btn btn-secondary" on:click={progress(10000)}>PROGRESS (10000)</button>
        <button class="btn btn-secondary" on:click={notifyComplete}>complete</button>
        <button class="btn btn-secondary" on:click={toggleAutoplay}>autoplay</button>
    </div>
</section>

<section class="mt-4">
    <div class="bg-neutral w-100 p-4 grid grid-cols-2">
        <div>
            <pre>playable   : {$service.can( e.PLAY )}</pre>
            <pre>autoplay   : {$service.context.autoplay}</pre>
            <pre>fullscreen : {$service.context.fullscreen }</pre>
        </div>
        <div> </div>
    </div>
</section>
<section class="mt-4">
    <div class="bg-neutral w-100 p-4 grid grid-cols-2">
        <pre>event : {fy( $service._event.data )}</pre>
        <pre>context: {fy( $service.context )}</pre>
    </div>
</section>

<script>
    import { onMount } from "svelte"
    import { appMachine, e } from "$lib/state/app-machine.js"
    import { useMachine } from "@xstate/svelte"
    import { v4 as uuidv4 } from "uuid"
    import Stat from "$lib/cmp/Stat.svelte"


    let stateLog = []
    console.clear()

    const { state, send, service } = useMachine( appMachine )

    service.subscribe( s => {
        stateLog = [...stateLog, s.event]
        console.log( 'state', s.value )
    } )

    //helpers
    const uid = () => uuidv4().split( '-' )[0]
    const fy = o => JSON.stringify( o, ( key, value ) => value === null ? "null" : value, 2 )
    const createTrack = ( { id = uid(), name, elapsed = 0, duration = 3000 } ) => ({ name, elapsed, duration, id })
    const track = createTrack( { name: 'foobar', duration: 3000 } )
    const fakeTracks = count => new Array( count ).fill( null ).map( ( v, name ) => createTrack( { name: name + 1, duration: 1000 * Math.floor( Math.random() * 5 ) } ) )


    // handlers
    const play = () => service.send( { type: e.PLAY } )
    const pause = () => service.send( { type: e.PAUSE } )
    const resume = () => service.send( { type: e.RESUME } )
    const skip = () => service.send( { type: e.SKIP } )
    const back = () => service.send( { type: e.BACK } )
    const queueAlbum = () => service.send( { type: e.QUEUE_REPLACE, detail: { tracks: fakeTracks( 3 ) } } )
    const queueTrack = () => service.send( { type: e.QUEUE_APPEND, detail: { tracks: fakeTracks( 1 ) } } )
    const progress = value => () => service.send( { type: e.PROGRESS, detail: { value } } )
    const notifyLoaded = () => service.send( { type: e.LOADED, detail: { track } } )
    const toggleAutoplay = () => service.send( { type: e.AUTOPLAY } )
    const toggleFullscreen = () => service.send( { type: e.FULLSCREEN } )

    // notes
    ////////////////////
    // only thing happening in an EvenHandler is to send an Event

    onMount( () => {
        window.service = service
        // inspect( { iframe: false } )
    } )


</script>

<br>
<div class="m-6">

    <section class="my-4 p-4 bg-neutral grid grid-cols-4 space-x-4">
        <Stat name="player" value={$service.value.player}/>
        <Stat name="queue" value={$service.value.queue}/>
        <Stat name="fullscreen" value={$service.value.fullscreen} />
        <Stat name="autoplay" value={$service.value.autoplay}/>
    </section>

    <section class="grid grid-cols-3 space-x-4 p-4 bg-neutral">
        <div class="flex flex-col space-y-4">
            <p class="text-xl uppercase">transport</p>
            <div class="radial-progress text-primary mx-auto text-center" class:animate-spin={$service.matches('player.loading')} style="--value:90; --size:2rem"></div>
            <button class="btn btn-accent" on:click={play} disabled={!$service.can(e.PLAY)}>play</button>
            <button class="btn btn-accent" on:click={resume} disabled={!$service.can(e.RESUME)}>resume</button>
            <button class="btn btn-accent" on:click={pause} disabled={!$service.can(e.PAUSE)}>pause</button>
            <button class="btn btn-accent" on:click={skip} disabled={!$service.can(e.SKIP)}>skip</button>
            <button class="btn btn-accent" on:click={back} disabled={!$service.can(e.BACK)}>back</button>
        </div>

        <div class="flex flex-col space-y-2">
            <p class="text-xl uppercase">events</p>
            <button class="btn btn-secondary" on:click={queueAlbum}>q album ( replace )</button>
            <button class="btn btn-secondary" on:click={queueTrack}>q track ( append )</button>
            <button class="btn btn-secondary" on:click={progress(10000)}>complete</button>
            <button class="btn btn-secondary" on:click={notifyLoaded}>loaded</button>
            <button class="btn btn-secondary" on:click={toggleFullscreen}>fullscreen</button>
            <button class="btn btn-secondary" on:click={toggleAutoplay}>autoplay</button>
        </div>
        <pre class="text-sm">event : {fy( $service._event.data )}</pre>
    </section>

<!--    <section class="mt-4">-->
<!--        <div class="bg-neutral w-100 p-4 grid grid-cols-2">-->
<!--            <div>-->
<!--                <pre>playable   : {$service.can( e.PLAY )}</pre>-->
<!--                <pre>autoplay   : {$service.context.autoplay}</pre>-->
<!--                <pre>fullscreen : {$service.context.fullscreen }</pre>-->
<!--            </div>-->
<!--            <div></div>-->
<!--        </div>-->
<!--    </section>-->

    <section class="mt-4">
        <div class="bg-neutral w-100 p-4 grid grid-cols-4 text-sm">
            <pre>context: {fy( $service.context )}</pre>
            <pre>track: {fy( $service.context.track )}</pre>
            <pre>queue: {fy( $service.context.q )}</pre>
            <pre>history: {fy( $service.context.h )}</pre>
        </div>
    </section>
</div>

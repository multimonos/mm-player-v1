<script>
    import { onMount } from "svelte"
    import { appMachine } from "$lib/state-machine/app-machine.js"
    import { useMachine } from "@xstate/svelte"
    import { v4 as uuidv4 } from "uuid"
    import { fy } from "$lib/string-utils.js"
    import Stat from "$lib/cmp/Stat.svelte"
    import Errors from "$lib/cmp/Errors.svelte"
    import { ErrorEvent, EvolveMediaEvent, FullscreenToggleEvent, PauseEvent, PlayEvent, ProgressEvent, QueueAppendEvent, QueueClearEvent, QueueNextEvent, QueuePreviousEvent, QueueReplaceEvent, } from "$lib/state-machine/events"
    import { LoadingTag, PlayingTag } from "$lib/state-machine/tags.js"
    // import Image from "$lib/cmp/Image.svelte"


    // const keep = [ Sketch, Image ]
    console.clear()

    const { state, send, service } = useMachine( appMachine )

    service.subscribe( s => {
        if ( ! [ 'progress' ].includes( s._event.name ) ) {
            // console.log( s._event )
        }
    } )

    // vars
    const images = [
        { type: 'image', url: "/1.png" },
        { type: 'image', url: "/2.png" },
        { type: 'image', url: "/3.png" },
    ]
    const p5js = [
        { type: 'p5js', url: "/src/lib/albums/demo/red.js" },
        { type: 'p5js', url: "/src/lib/albums/demo/green.js" },
        { type: 'p5js', url: "/src/lib/albums/demo/blue.js" },
    ]

    //helpers
    const uid = () => uuidv4().split( '-' )[0]

    const createTrack = ( { id = uid(), name, duration = 3000, media = null } ) => ({ name, duration, media, id })
    const fakeTracks = ( count, medias ) => new Array( count )
        .fill( null )
        .map( ( v, i ) =>
            createTrack( {
                name: i + 1,
                duration: 3000 * Math.ceil( Math.random() * 4 ),
                media: medias[i % medias.length]
            } ) )
    const createError = ( { message = '', code = null } ) => ({ code, message })


    // transport
    const play = () => service.send( { type: PlayEvent } )
    const pause = () => service.send( { type: PauseEvent } )
    const resume = () => service.send( { type: ResumeEvent } )
    const skip = () => service.send( { type: QueueNextEvent } )
    const back = () => service.send( { type: QueuePreviousEvent } )
    // queue
    const queueClear = () => service.send( { type: QueueClearEvent } )
    const queueReplace = ( count, medias ) => () => service.send( { type: QueueReplaceEvent, detail: { tracks: fakeTracks( count, medias ) } } )
    const queueAppend = ( count, medias ) => () => service.send( { type: QueueAppendEvent, detail: { tracks: fakeTracks( count, medias ) } } )
    // progress
    const progress = value => () => service.send( { type: ProgressEvent, value } )
    // ui
    const toggleAutoplay = () => service.send( { type: E_AUTOPLAY } )
    const toggleFullscreen = () => service.send( { type: FullscreenToggleEvent } )
    // errors
    const error = () => service.send( { type: ErrorEvent, error: createError( { message: 'some error', code: 666 } ) } )
    const errorQueue = () => service.send( { type: QueueAppendEvent, detail: { tracks: [ createTrack( { id: 'error track', duration: 4000, "media": { type: 'unknown' } } ) ] } } )
    // media
    const evolveMedia = e => {
        // setTimeout(()=>e.detail.noLoop(),500)
        // service.send({type:E_EVOLVE_MEDIA, ref:e.detail})
        // service.send({type:E_EVOLVE_MEDIA, message:'an issue'})
        service.send( { type: EvolveMediaEvent, ref: e.detail} )
        console.log( 'evolveMedia', e.detail )
    }

    onMount( () => {
        window.service = service

        // fake a progress timer
        const update = () => {
            if ( ! $service ) {
                document.location.reload()
            }
            if ( $service.hasTag( PlayingTag ) ) {
                service.send( { type: ProgressEvent, value: 333 } )
            }
            setTimeout( () => requestAnimationFrame( update ), 250 )
        }
        update()

    } )


</script>

<br>
<div class="m-6">

    <section class="m-4 p-4 bg-neutral grid grid-cols-4 space-x-4">
        <Stat name="player" value={$service.value.player}/>
        <Stat name="queue" value={$service.value.queue}/>
        <Stat name="fullscreen" value={$service.value.fullscreen}/>
        <Stat name="error" value={$service.value.error}/>
    </section>

    <section class="m-4 p-4 bg-neutral">
    </section>

    <section class="m-4 grid grid-cols-3 space-x-4 p-4 bg-neutral">

        <div class="flex flex-col space-y-4">
            <p class="text-xl uppercase">transport</p>
            <button class="btn btn-accent" on:click={play} disabled={!$service.can(PlayEvent)}>play</button>
            <div class="radial-progress text-primary mx-auto text-center" class:animate-spin={$service.hasTag(LoadingTag)} style="--value:90; --size:2rem"></div>
            <!--            <button class="btn btn-accent" on:click={resume} disabled={!$service.can(PlayEvent)}>resume</button>-->
            <button class="btn btn-accent" on:click={pause} disabled={!$service.can(PauseEvent)}>pause</button>
            <button class="btn btn-accent" on:click={skip} disabled={!$service.can(QueueNextEvent)}>next</button>
            <button class="btn btn-accent" on:click={back} disabled={!$service.can(QueuePreviousEvent)}>previous</button>
        </div>

        <div class="flex flex-col space-y-2 ">
            <p class="text-xl uppercase">q events</p>
            <div class="grid grid-cols-4 gap-2">
                <button class="btn btn-accent" on:click={queueReplace(3, images)}>x3</button>
                <button class="btn btn-accent" on:click={queueReplace(1, images)}>x1</button>
                <button class="btn btn-secondary" on:click={queueAppend(3, images)}>+3</button>
                <button class="btn btn-secondary" on:click={queueAppend(1, images)}>+1</button>
                <button class="btn btn-accent" on:click={queueReplace(3, p5js)}>x3 . p5</button>
                <button class="btn btn-accent" on:click={queueReplace(1, p5js)}>x1 . p5</button>
                <button class="btn btn-secondary" on:click={queueAppend(3, p5js)}>+3 . p5</button>
                <button class="btn btn-secondary" on:click={queueAppend(1, p5js)}>+1 . p5</button>
                <button class="btn btn-secondary" on:click={queueClear}>clr</button>
                <button class="btn btn-error" on:click={errorQueue}>err</button>
            </div>
            <p class="text-xl uppercase">events</p>
            <!--            <button class="btn btn-secondary" on:click={notifyLoaded}>loaded</button>-->
            <div class="grid grid-cols-2 gap-2">
                <button class="btn btn-secondary" on:click={progress(250)}>+250 progress</button>
                <button class="btn btn-secondary" on:click={toggleFullscreen}>fullscreen</button>
                <button class="btn btn-secondary" on:click={error}>error</button>
                <button class="btn btn-secondary" on:click={evolveMedia}>evolve</button>
            </div>
        </div>

        <div class="flex flex-col">
            <div class="m-2 grid grid-cols-2">
                <pre>{$service.context.track?.name}</pre>
                <pre>{$service.context.progress} of {$service.context.track?.duration}</pre>
            </div>
            <div class="w-full h-full bg-primary-content relative flex flex-col items-center justify-center">

                {#if $service.hasTag( LoadingTag )}
                    <div class="absolute w-full h-full flex items-center justify-center align-middle z-10">
                        <div class="radial-progress animate-spin text-secondar" style="--value:70; --size:12rem; --thickness: 2px;"></div>
                    </div>
                {/if}

                <div>
                    <!--                    test-->
                    {#if $service.hasTag( PlayingTag ) && $service.context.media?.component}
                        <svelte:component
                                this={$service.context.media.component}
                                {...$service.context.media.componentProps}
                                on:created={evolveMedia}
                        />
                    {/if}
                </div>
            </div>
        </div>

    </section>


    <section class="m-4">
        <div class="bg-neutral w-100 p-4 grid grid-cols-4 text-sm">
            <pre>media : {fy( $service.context.media )}</pre>
            <pre>track : {fy( $service.context.track )}</pre>
            <pre>queue : {fy( $service.context.q )}</pre>
            <pre>hist: {fy( $service.context.h )}</pre>
        </div>
    </section>

    <section class="m-4 grid grid-cols-3 bg-neutral text-sm">
        <pre class="overflow-x-hidden">event : {fy( $service._event.data )}</pre>
        <pre>context: {fy( $service.context )}</pre>
    </section>

</div>

<Errors errors={$service.context.e}/>


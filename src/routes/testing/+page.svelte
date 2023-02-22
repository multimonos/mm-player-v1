<script>
    import { PUBLIC_MEDIA_URL } from "$env/static/public"
    import { ErrorEvent, EvolveMediaEvent, FullscreenToggleEvent, PauseEvent, PlayEvent, ProgressEvent, QueueAppendEvent, QueueClearEvent, QueueNextEvent, QueuePreviousEvent, QueueReplaceEvent, ScreenshotEvent, SuccessEvent, } from "$lib/state-machine/events"
    import { LoadingTag, PlayingTag, RenderableTag } from "$lib/state-machine/tags.js"
    import { service } from "$lib/state-machine/app-machine.js"
    import { onMount } from "svelte"
    import { testTracks } from "$lib/test/test-tracks.js"
    import { fy } from "$lib/util/string.js"
    // com
    import StateOf from "./com/StateOf.svelte"
    import Toasts from "$lib/com/Toasts.svelte"
    import Queue from "$lib/com/Queue.svelte"
    import Transport from "$lib/com/transport/Transport.svelte"
    import History from "$lib/com/History.svelte"
    import NowPlaying from "$lib/com/NowPlaying.svelte"
    import Media from "$lib/com/media/Media.svelte"


    // service
    ////////////////////
    service.subscribe( s => {
        if ( ! [ ProgressEvent ].includes( s._event.name ) ) {
            // console.log( s.value,s._event )
        }
    } )


    // vars
    ////////////////////
    const tracks = testTracks.map( track => {
        track.media.url = track.media.url.replace( 'PUBLIC_MEDIA_URL', PUBLIC_MEDIA_URL )
        return track
    } )
    const imageTracks = tracks.filter( t => t.media.type === 'image' )
    const p5jsTracks = tracks.filter( t => t.id.includes( 'p5js' ) )


    // transport event handlers
    ////////////////////
    const play = () => service.send( { type: PlayEvent } )
    const pause = () => service.send( { type: PauseEvent } )
    const resume = () => service.send( { type: ResumeEvent } )
    const skip = () => service.send( { type: QueueNextEvent } )
    const back = () => service.send( { type: QueuePreviousEvent } )

    // queue handlers
    ////////////////////
    const queueClear = () =>
        service.send( { type: QueueClearEvent } )

    const queueReplace = tracks => () =>
        service.send( { type: QueueReplaceEvent, tracks: Array.isArray( tracks ) ? tracks : [ tracks ] } )

    const queueAppend = tracks => () =>
        service.send( { type: QueueAppendEvent, tracks: Array.isArray( tracks ) ? tracks : [ tracks ] } )

    // toast handlers
    ////////////////////
    const toastError = () =>
        service.send( { type: ErrorEvent, data: { message: '🌶 some hot error' } } )

    const toastSuccess = () =>
        service.send( { type: SuccessEvent, data: { message: '🌈 a successful adventure' } } )

    // other
    ////////////////////
    const progress = value => () =>
        service.send( { type: ProgressEvent, value } )

    const toggleFullscreen = () =>
        service.send( { type: FullscreenToggleEvent } )

    const mediaScreenshot = e =>
        service.send( { type: ScreenshotEvent } )


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
    <section class="sticky top-0 z-50 m-4 p-4 bg-neutral grid grid-cols-4 space-x-4">
        <StateOf name="player" value={$service.value.player}/>
        <StateOf name="queue" value={$service.value.queue}/>
        <StateOf name="fullscreen" value={$service.value.fullscreen}/>
        <StateOf name="toasts" value={$service.value.toasts}/>
    </section>

    <section class="m-4 p-8 bg-neutral">
        <p>The media sources for the test scripts exist in 1 or 2 locations which is set in the <code>.env</code> file using <code>PUBLIC_MEDIA_URL</code>.</p>
        <ul class="list-disc list-inside">
            <li><a class="link" href="http://mm-media.test">http://mm-media.test</a></li>
            <li><a class="link" href="https://mm-media.netlify.app">https://mm-media.netlify.app</a></li>
        </ul>
    </section>

    <section class="m-4 p-4 bg-neutral">
        <p class="text-xl uppercase">widgets</p>
        <div class="flex space-x-4 space-y-4">

            <Transport
                    isLoading={$service.hasTag(LoadingTag)}
                    canPause={$service.can(PauseEvent)}
                    canPlay={$service.can(PlayEvent)}
                    canSkipNext={$service.can(QueueNextEvent)}
                    canSkipPrevious={$service.can(QueuePreviousEvent)}
                    on:play={play}
                    on:pause={pause}
                    on:skip-next={skip}
                    on:skip-previous={back}
            />

        </div>
    </section>

    <section class="m-4 grid grid-cols-3 space-x-4 p-4 bg-neutral">
        <div>
            <div class="flex flex-col space-y-4">
                <p class="text-xl uppercase">transport</p>

                <div class="radial-progress text-primary mx-auto text-center" class:animate-spin={$service.hasTag(LoadingTag)} style="--value:90; --size:2rem"></div>
                <button class="btn btn-accent" on:click={play} disabled={!$service.can(PlayEvent)}>play</button>
                <button class="btn btn-accent" on:click={pause} disabled={!$service.can(PauseEvent)}>pause</button>
                <button class="btn btn-accent" on:click={skip} disabled={!$service.can(QueueNextEvent)}>next</button>
                <button class="btn btn-accent" on:click={back} disabled={!$service.can(QueuePreviousEvent)}>previous</button>
            </div>

            <div class="mt-4">
                <p class="text-lg uppercase">history</p>
                <History tracks={$service.context.h}/>
                <br>

                <p class="text-lg uppercase">now playing</p>
                <NowPlaying track={$service.context.track}/>
                <br>

                <p class="text-lg uppercase">queue</p>
                <Queue tracks={$service.context.q}/>
            </div>
        </div>

        <div class="flex flex-col space-y-2 ">
            <p class="text-xl uppercase">Q-Replace</p>
            <div class="grid grid-cols-4 gap-2">
                <button class="btn btn-info" on:click={queueReplace(tracks)}>all</button>
                <button class="btn btn-accent" on:click={queueReplace(imageTracks[0])}>1 img</button>
                <button class="btn btn-accent" on:click={queueReplace(imageTracks)}>3 img</button>
                <button class="btn btn-accent" on:click={queueReplace(p5jsTracks[0])}>1 p5</button>
                <button class="btn btn-accent" on:click={queueReplace(p5jsTracks)}>3 p5</button>
                <button class="btn btn-secondary" on:click={queueClear}>clr</button>
            </div>

            <p class="text-xl uppercase">Q-Append</p>
            <div class="grid grid-cols-2 gap-2">
                {#each tracks as track}
                    <button data-tid="q-{track.id}" class="btn btn-warning normal-case" on:click={queueAppend(track)}>{track.id}</button>
                {/each}
            </div>

            <p class="text-xl uppercase">events</p>
            <div class="grid grid-cols-2 gap-2">
                <button class="btn normal-case btn-secondary" on:click={progress(1000)}>+ 1s progress</button>
                <button class="btn normal-case btn-secondary" on:click={toggleFullscreen}>FullscreenToggle</button>
                <button class="btn normal-case btn-secondary" on:click={mediaScreenshot}>ScreenshotEvent</button>
            </div>
            <p class="text-xl uppercase">toasts</p>
            <div class="grid grid-cols-2 gap-2">
                <button class="btn normal-case btn-error" on:click={toastError}>ErrorEvent</button>
                <button class="btn normal-case btn-success" on:click={toastSuccess}>SuccessEvent</button>
            </div>
        </div>

        <div class="flex flex-col">
            <div class="m-2 ">
                <pre>{$service.context.track?.name}</pre>
                <pre>{$service.context.progress} of {$service.context.track?.duration}</pre>
            </div>
            <div class="w-full h-full bg-primary-content relative flex flex-col items-center justify-center">

                {#if $service.hasTag( LoadingTag )}
                    <div class="absolute w-full h-full flex items-center justify-center align-middle z-10 bg-gray-500/50">
                        <div class="radial-progress animate-spin text-secondar" style="--value:70; --size:12rem; --thickness: 2px;"></div>
                    </div>
                {/if}

                <div>
                    {#if ($service.hasTag( RenderableTag )) && $service.context.media?.component}
                        <Media component={$service.context.media.component} props={$service.context.media.componentProps} />
                    {/if}
                </div>
            </div>
        </div>

    </section>


    <section class="m-4">
        <div class="bg-neutral w-100 p-4 grid grid-cols-4 text-sm">
            <pre>queue : {fy( $service.context.q )}</pre>
            <pre>media : {fy( $service.context.media )}</pre>
            <pre>track : {fy( $service.context.track )}</pre>
            <pre>historty: {fy( $service.context.h )}</pre>
            <pre>toast : {fy( $service.context.toasts )}</pre>
        </div>
    </section>

    <section class="m-4 grid grid-cols-4 bg-neutral text-sm">
        <pre>states: {fy( $service.value )}</pre>
        <pre>context: {fy( $service.context )}</pre>
        <pre class="overflow-x-hidden">event : {fy( $service._event.data )}</pre>
    </section>

</div>

<Toasts toasts={$service.context.toasts}/>


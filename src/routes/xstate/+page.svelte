<script>
    import { PUBLIC_MEDIA_URL } from "$env/static/public"
    import { onMount } from "svelte"
    import { service } from "./lib/state-machine/app-machine.js"
    import { v4 as uuidv4 } from "uuid"
    import { fy } from "./lib/utils.js"
    import Stat from "./lib/cmp/Stat.svelte"
    import Toasts from "./lib/cmp/Toasts.svelte"
    import { ErrorEvent, EvolveMediaEvent, FullscreenToggleEvent, PauseEvent, PlayEvent, ProgressEvent, QueueAppendEvent, QueueClearEvent, QueueNextEvent, QueuePreviousEvent, QueueReplaceEvent, ScreenshotEvent, SuccessEvent, } from "./lib/state-machine/events"
    import { LoadingTag, PlayingTag, RenderableTag } from "./lib/state-machine/tags.js"
    // const { state, send, service } = useMachine( appMachine )


    console.clear()


    service.subscribe( s => {
        if ( ! [ ProgressEvent ].includes( s._event.name ) ) {
            // console.log( s.value,s._event )
        }
    } )

    // helpers
    ////////////////////
    const createTrack = (
        {
            id = uuidv4().split( '-' )[0],
            name,
            duration = 3000,
            media = null
        } ) => ({ name, duration, media, id })

    const fakeTracks = ( count, medias ) => new Array( count )
        .fill( null )
        .map( ( v, i ) =>
            createTrack( {
                name: i + 1,
                // duration: 3000 * Math.ceil( Math.random() * 4 ),
                duration: 1000 * Math.ceil( Math.random() * 4 ),
                media: medias[i % medias.length]
            } ) )


    // vars
    ////////////////////
    const images = [
        { type: 'image', url: "/1.png" },
        { type: 'image', url: "/2.png" },
        { type: 'image', url: "/3.png" },
    ]
    const p5js = [
        { type: 'p5js', url: `${ PUBLIC_MEDIA_URL }/test/p5js/red.bundle.js` },
        { type: 'p5js', url: `${ PUBLIC_MEDIA_URL }/test/p5js/green.bundle.js` },
        { type: 'p5js', url: `${ PUBLIC_MEDIA_URL }/test/p5js/blue.bundle.js` },
    ]

    const testTracks = [
        createTrack( { id: 'preload-ok', name: '🧪 preload ... ok', duration: 3000, media: { type: 'p5js', url: `${ PUBLIC_MEDIA_URL }/test/p5js/preload.bundle.js` } } ),
        createTrack( { id: 'prepare-async-err', name: '🧪 prepare async ... error', duration: 3000, media: { type: 'p5js', url: `${ PUBLIC_MEDIA_URL }/test/p5js/prepare-async-error.bundle.js` } } ),
        // createTrack( { id: 'large-image', name: '🧪 large image', duration: 3000, media: { type: 'image', url: "https://multimonos-media-tests.netlify.app/4000x4000-8.jpg" } } ),
        createTrack( { id: 'import-scripts', name: '🧪 import scripts test', duration: 4000, media: { type: 'p5js', url: `${ PUBLIC_MEDIA_URL }/test/p5js/import-dependency.bundle.js` } } ),
        createTrack( { id: 'custom-methods', name: '🧪 custom methods', duration: 10000, media: { type: 'p5js', url: `${ PUBLIC_MEDIA_URL }/test/p5js/custom-methods.bundle.js` } } ),
        createTrack( { id: 'unknown-media', name: '🧪 unknown media', duration: 4000, media: { type: 'foobar/bam' } } ),
        createTrack( { id: 'inifinite-play', name: '🧪 infinite play', duration: false, media: { type: 'p5js', url: `${ PUBLIC_MEDIA_URL }/test/p5js/infinite-play.bundle.js` } } ),
        createTrack( { id: 'audio-osc', name: '🧪 audio oscillator', duration: 2000, media: { type: 'p5js', url: `${ PUBLIC_MEDIA_URL }/test/p5js/audio-osc.bundle.js` } } ),
        createTrack( { id: 'audio-mic', name: '🧪 audio microphone', duration: false, media: { type: 'p5js', url: `${ PUBLIC_MEDIA_URL }/test/p5js/audio-mic.bundle.js` } } ),
        createTrack( { id: 'audio-url', name: '🧪 audio url', duration: 6000, media: { type: 'p5js', url: `${ PUBLIC_MEDIA_URL }/test/p5js/audio-url.bundle.js` } } ),
        createTrack( { id: 'prepare({ params })', name: '🧪 audio from prepare( { params } ) - dolphin', duration: 3000, media: { type: 'p5js', url: `${ PUBLIC_MEDIA_URL }/test/p5js/prepare-params.bundle.js`, params: { index: 2 } } } ),
        createTrack( { id: 'querystring-params', name: '🧪 querystring params via import.meta.url', duration: 3000, media: { type: 'p5js', url: `${ PUBLIC_MEDIA_URL }/test/p5js/querystring.bundle.js?foo=bar&bam=bash` } } ),
        createTrack( {
            id: 'querystring-audio',
            name: '🧪 audio via querystring arg',
            duration: 3000,
            media: { type: 'p5js', url: `${ PUBLIC_MEDIA_URL }/test/p5js/querystring-audio.bundle.js?audioUrl=https%3A%2F%2Fres.cloudinary.com%2Fmultimonos%2Fvideo%2Fupload%2Fv1612053124%2Faudio%2Fanimals%2Fcat.mp3` }
        } ),
        createTrack( { id: 'coldwave-moonrise', name: '🌚 coldwave moonrise 🌚', duration: 16000, media: { type: 'p5js', url: `${ PUBLIC_MEDIA_URL }/sketch/coldwave-moonrise/audio.bundle.js` } } ),
    ]


    // handlers
    ////////////////////

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
    const queueTest = track => () => service.send( { type: QueueAppendEvent, detail: { tracks: [ track ] } } )
    const queueAllTests = () => service.send( { type: QueueReplaceEvent, detail: { tracks: testTracks } } )
    const progress = value => () => service.send( { type: ProgressEvent, value } )
    const toggleFullscreen = () => service.send( { type: FullscreenToggleEvent } )
    // toasts
    const toastError = () => service.send( { type: ErrorEvent, data: { message: '🌶 some hot error' } } )
    const toastSuccess = () => service.send( { type: SuccessEvent, data: { message: '🌈 a successful adventure' } } )

    // other
    const evolveMedia = e => service.send( { type: EvolveMediaEvent, ref: e.detail } )
    const mediaScreenshot = e => service.send( { type: ScreenshotEvent } )

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

    <section class="m-4 p-8 bg-neutral">
        <p>The media sources for the test scripts exist in 1 or 2 locations which is set in the <code>.env</code> file.</p>
        <ul class="list-disc list-inside">
            <li><a class="link" href="http://mm-media.test">http://mm-media.test</a></li>
            <li><a class="link" href="https://mm-media.netlify.app">https://mm-media.netlify.app</a></li>
        </ul>
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
                <p class="text-lg uppercase">queue</p>
                <ul class="list-none mt-4">
                    {#each $service.context.q as item}
                        <li class="py-1">{item.name}</li>
                    {/each}
                </ul>
                <br>
                <p class="text-lg uppercase">history</p>
                <ul class="list-none mt-4">
                    {#each $service.context.h as item}
                        <li class="py-1">{item.name}</li>
                    {/each}
                </ul>
            </div>
        </div>

        <div class="flex flex-col space-y-2 ">
            <p class="text-xl uppercase">q events</p>
            <div class="grid grid-cols-4 gap-2">
                <button class="btn btn-accent" on:click={queueReplace(1, images)}>x1</button>
                <button class="btn btn-accent" on:click={queueReplace(3, images)}>x3</button>
                <button class="btn btn-secondary" on:click={queueAppend(1, images)}>+1</button>
                <button class="btn btn-secondary" on:click={queueAppend(3, images)}>+3</button>
                <button class="btn btn-accent" on:click={queueReplace(3, p5js)}>x3 . p5</button>
                <button class="btn btn-accent" on:click={queueReplace(1, p5js)}>x1 . p5</button>
                <button class="btn btn-secondary" on:click={queueAppend(1, p5js)}>+1 . p5</button>
                <button class="btn btn-secondary" on:click={queueAppend(3, p5js)}>+3 . p5</button>
                <button class="btn btn-secondary" on:click={queueClear}>clr</button>
            </div>

            <p class="text-xl uppercase">tests</p>
            <div class="grid grid-cols-2 gap-2">
                <button class="btn btn-info" on:click={queueAllTests}>all</button>
                {#each testTracks as track}
                    <button class="btn btn-warning" on:click={queueTest(track)}>{track.id}</button>
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
                    <!--                    test-->
                    {#if ($service.hasTag( RenderableTag )) && $service.context.media?.component}
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
            <pre>toast : {fy( $service.context.toasts )}</pre>
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

<Toasts toasts={$service.context.toasts}/>


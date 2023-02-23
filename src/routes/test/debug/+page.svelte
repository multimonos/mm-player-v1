<script>
import { ErrorEvent, FullscreenToggleEvent, ProgressEvent, QueueAppendEvent, QueueClearEvent, QueueReplaceEvent, ScreenshotEvent, SuccessEvent, } from "$lib/state-machine/events.js"
import { LoadingTag, PlayingTag, RenderableTag } from "$lib/state-machine/tags.js"
import { service } from "$lib/state-machine/app-machine.js"
import { onMount } from "svelte"
import { fy } from "$lib/util/string.js"
// com
import StateOf from "./com/StateOf.svelte"
import Toasts from "$lib/com/Toasts.svelte"
import Queue from "$lib/com/Queue.svelte"
import History from "$lib/com/History.svelte"
import Media from "$lib/com/media/Media.svelte"

// props
export let data


// service
////////////////////
service.subscribe( s => {
    if ( ! [ ProgressEvent ].includes( s._event.name ) ) {
        // console.log( s.value,s._event )
    }
} )


// vars
////////////////////
console.log( { data } )
const tracks = data.album.tracks
const imageTracks = tracks.filter( t => t.media.media_type === 'image' )
const p5jsTracks = tracks.filter( t => t.id.includes( 'p5js' ) )


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

<div class="m-4">

    <section class="mb-2 p-2 bg-neutral flex space-x-2">
        <StateOf name="player" value={$service.value.player}/>
        <StateOf name="queue" value={$service.value.queue}/>
        <StateOf name="toasts" value={$service.value.toasts}/>
    </section>


    <section class="p-2 mb-2 bg-netrual flex flex-col space-y-2 bg-neutral text-sm min-h-[40vh]">
        <div class="mb-2 flex items-center justify-between h-8">
            <p class="overflow-x-clip">{$service.context.track?.name}</p>
            <p>{$service.context.progress} of {$service.context.track?.duration}</p>
        </div>
        <div class="w-full h-full bg-primary-content relative flex flex-col items-center justify-center">
            {#if $service.hasTag( LoadingTag )}
                <div class="absolute w-full h-full flex items-center justify-center align-middle z-10 bg-gray-500/50">
                    <div class="radial-progress animate-spin text-secondar" style="--value:70; --size:12rem; --thickness: 2px;"></div>
                </div>
            {/if}
            <div class="h-full">
                {#if ($service.hasTag( RenderableTag )) && $service.context.media?.component}
                    <Media component={$service.context.media.component} props={$service.context.media.componentProps}/>
                {/if}
            </div>
        </div>
    </section>


    <section class="p-2 mb-2 bg-netrual flex flex-col space-y-2 bg-neutral text-sm">
        <p class="text-xs text-neutral-content/75 uppercase">now playing</p>
        {$service.context?.track?.name}
    </section>

    <section class="p-2 mb-2 bg-netrual grid grid-cols-2 gap-2 bg-neutral text-sm">
        <div>
            <p class="text-xs text-neutral-content/75 uppercase">history</p>
            <History tracks={$service.context.h}/>
        </div>
        <div>
            <p class="text-xs text-neutral-content/75 uppercase">queue</p>
            <Queue tracks={$service.context.q}/>
        </div>
    </section>

    <section class="p-2 mb-2 bg-netrual flex flex-col space-y-2 bg-neutral text-sm">
        <p class="text-xs text-neutral-content/75 uppercase">Q-Replace</p>
        <div class="grid grid-cols-2 gap-2 lg:grid-cols-6">
            <button class="btn-sm rounded btn-info" on:click={queueReplace(tracks)}>all</button>
            <button class="btn-sm rounded btn-accent" on:click={queueReplace(imageTracks[0])}>1 img</button>
            <button class="btn-sm rounded btn-accent" on:click={queueReplace(imageTracks)}>3 img</button>
            <button class="btn-sm rounded btn-accent" on:click={queueReplace(p5jsTracks[0])}>1 p5</button>
            <button class="btn-sm rounded btn-accent" on:click={queueReplace(p5jsTracks)}>3 p5</button>
            <button class="btn-sm rounded btn-secondary" on:click={queueClear}>clr</button>
        </div>
    </section>

    <section class="p-2 mb-2 bg-netrual flex flex-col space-y-2 bg-neutral text-sm">
        <p class="text-xs text-neutral-content/75 uppercase">Q-Append</p>
        <div class="grid grid-cols-2 lg:grid-cols-6 gap-2">
            {#each tracks as track}
                <button data-tid="q-{track.id}" class="btn-sm btn-warning rounded normal-case" on:click={queueAppend(track)}>{track.id}</button>
            {/each}
        </div>
    </section>

    <section class="p-2 mb-2 bg-netrual flex flex-col space-y-2 bg-neutral text-sm">
        <p class="text-sm text-neutral-content/75 uppercase">events</p>
        <div class="grid grid-cols-2 lg:grid-cols-6 gap-2">
            <button class="btn-sm normal-case rounded btn-accent" on:click={progress(1000)}>+ 1s progress</button>
            <button class="btn-sm normal-case rounded btn-accent" on:click={toggleFullscreen}>FullscreenToggle</button>
            <button class="btn-sm normal-case rounded btn-accent" on:click={mediaScreenshot}>ScreenshotEvent</button>
        </div>
    </section>

    <section class="p-2 mb-2 bg-netrual flex flex-col space-y-2 bg-neutral text-sm">
        <p class="text-sm text-neutral-content/75 uppercase">toasts</p>
        <div class="grid grid-cols-2 lg:grid-cols-6 gap-2">
            <button class="btn-sm normal-case rounded btn-error" on:click={toastError}>ErrorEvent</button>
            <button class="btn-sm normal-case rounded btn-success" on:click={toastSuccess}>SuccessEvent</button>
        </div>
    </section>


    <section class="p-2 mb-2 bg-neutral flex flex-col space-y-2 text-sm overflow-x-scroll">
        <pre>queue : {fy( $service.context.q )}</pre>
        <pre>media : {fy( $service.context.media )}</pre>
        <pre>track : {fy( $service.context.track )}</pre>
        <pre>historty: {fy( $service.context.h )}</pre>
        <pre>toast : {fy( $service.context.toasts )}</pre>
    </section>

    <section class="p-2 mb-2 bg-neutral flex flex-col space-y-2 text-sm overflow-x-scroll">
        <pre>states: {fy( $service.value )}</pre>
        <pre>event : {fy( $service._event.data )}</pre>
<!--        <pre>context: {fy( $service.context )}</pre>-->
    </section>

    <section class="mb-2 p-2 bg-neutral">
        <p>The media sources for the test scripts exist in 1 or 2 locations which is set in the <code>.env</code> file using <code>PUBLIC_MEDIA_URL</code>.</p>
        <ul class="list-disc list-inside">
            <li><a class="link" href="http://mm-media.test">http://mm-media.test</a></li>
            <li><a class="link" href="https://mm-media.netlify.app">https://mm-media.netlify.app</a></li>
        </ul>
    </section>
</div>
<Toasts toasts={$service.context.toasts}/>

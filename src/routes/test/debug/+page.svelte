<script>
import { FullscreenToggleEvent, NotifyEvent, QueueAppendEvent, QueueClearEvent, QueueReplaceThenPlayEvent, ScreenshotEvent, TimerProgressEvent, } from "$lib/state-machine/events.js"
import { LoadingTag, RenderableTag } from "$lib/state-machine/tags.js"
import { service } from "$lib/state-machine/app-machine.js"
import { onMount } from "svelte"
// com
import StateOf from "./com/StateOf.svelte"
import Media from "$lib/com/media/Media.svelte"
import DebugAccordion from "$lib/com/util/DebugAccordion.svelte"
import TrackList from "./com/TrackList.svelte"

// props
export let data


// service
////////////////////
service.subscribe( s => {
    if ( ! [ TimerProgressEvent ].includes( s._event.name ) ) {
        // console.log( s.value,s._event )
    }
} )


// vars
////////////////////
console.log( { data } )
const tracks = data.album?.tracks || []
// const imageTracks = tracks.filter( t => t.media.media_type === 'image' )
// const p5jsTracks = tracks.filter( t => t.id.includes( 'p5js' ) )


// queue handlers
////////////////////
const queueClear = () =>
    service.send( { type: QueueClearEvent } )

const queueReplace = tracks => () =>
    service.send( { type: QueueReplaceThenPlayEvent, tracks: Array.isArray( tracks ) ? tracks : [ tracks ] } )

const queueAppend = tracks => () =>
    service.send( { type: QueueAppendEvent, tracks: Array.isArray( tracks ) ? tracks : [ tracks ] } )

// toast handlers
////////////////////
const toastError = () =>
    service.send( { type: NotifyEvent, status: 'error', message: '🌶 some hot error' } )

const toastSuccess = () =>
    service.send( { type: NotifyEvent, status: 'success', message: '🌈 a successful adventure' } )

// other
////////////////////
const progress = value => () =>
    service.send( { type: TimerProgressEvent, value } )

const toggleFullscreen = () =>
    service.send( { type: FullscreenToggleEvent } )

const mediaScreenshot = e =>
    service.send( { type: ScreenshotEvent } )


onMount( () => {
    window.service = service
} )

// $:progress = $service.context.progress
</script>

<div class="m-4">

    <section class="mb-2 p-2 bg-neutral grid grid-cols-3 gap-2">
        <StateOf name="player" value={$service.value.player}/>
        <StateOf name="queue" value={$service.value.queue}/>
        <StateOf name="timer" value={$service.value.timer}/>
        <StateOf name="toasts" value={$service.value.toasts}/>
        <StateOf name="audio" value={`${$service.value.audio} ${$service.context.audioContext?.state}`}/>
    </section>

<!--    <section class="p-2 mb-2 bg-netrual flex flex-col space-y-2 bg-neutral text-sm min-h-[40vh]">-->
<!--        <div class="mb-2 flex items-center justify-between h-8">-->
<!--            <p class="overflow-x-clip">{$service.context.track?.name}</p>-->
<!--            <p>{$service.context.progress} of {$service.context.track?.duration}</p>-->
<!--        </div>-->
<!--        <div class="w-full h-full bg-primary-content relative flex flex-col items-center justify-center">-->
<!--            {#if $service.hasTag( LoadingTag )}-->
<!--                <div class="absolute w-full h-full flex items-center justify-center align-middle z-10 bg-gray-500/50">-->
<!--                    <div class="radial-progress animate-spin text-secondar" style="&#45;&#45;value:70; &#45;&#45;size:12rem; &#45;&#45;thickness: 2px;"></div>-->
<!--                </div>-->
<!--            {/if}-->
<!--            <div class="h-full">-->
<!--                {#if ($service.hasTag( RenderableTag )) && $service.context.media?.component}-->
<!--                    <Media component={$service.context.media.component} props={$service.context.media.componentProps}/>-->
<!--                {/if}-->
<!--            </div>-->
<!--        </div>-->
<!--    </section>-->


    <section class="p-2 mb-2 bg-netrual flex flex-col space-y-2 bg-neutral text-sm">
        <p class="text-xs text-neutral-content/75 uppercase">now playing</p>
        {$service.context?.track?.name}
    </section>

    <section class="p-2 mb-2 bg-netrual grid grid-cols-2 gap-2 bg-neutral text-sm">
        <div>
            <p class="text-xs text-neutral-content/75 uppercase">queue</p>
            <TrackList tracks={$service.context.q}/>
        </div>
        <div>
            <p class="text-xs text-neutral-content/75 uppercase">history</p>
            <TrackList tracks={$service.context.h}/>
        </div>
    </section>

<!--    <section class="p-2 mb-2 bg-netrual flex flex-col space-y-2 bg-neutral text-sm">-->
<!--        <p class="text-xs text-neutral-content/75 uppercase">Q-Replace</p>-->
<!--        <div class="grid grid-cols-2 gap-2 lg:grid-cols-6">-->
<!--            <button class="btn-sm rounded btn-info" on:click={queueReplace(tracks)}>all</button>-->
<!--            <button class="btn-sm rounded btn-accent" on:click={queueReplace(imageTracks[0])}>1 img</button>-->
<!--            <button class="btn-sm rounded btn-accent" on:click={queueReplace(imageTracks)}>3 img</button>-->
<!--            <button class="btn-sm rounded btn-accent" on:click={queueReplace(p5jsTracks[0])}>1 p5</button>-->
<!--            <button class="btn-sm rounded btn-accent" on:click={queueReplace(p5jsTracks)}>3 p5</button>-->
<!--            <button class="btn-sm rounded btn-primary" on:click={queueClear}>clr</button>-->
<!--        </div>-->
<!--    </section>-->

    <section class="p-2 mb-2 bg-netrual flex flex-col space-y-2 bg-neutral text-sm">
        <p class="text-xs text-neutral-content/75 uppercase">Q-Append</p>
        <div class="grid grid-cols-2 lg:grid-cols-6 gap-2">
            {#each tracks as track}
                <button data-tid="q-{track.slug}" class="btn-sm btn-secondary rounded normal-case" on:click={queueAppend(track)}>{track.slug}</button>
            {/each}
        </div>
    </section>

<!--    <section class="p-2 mb-2 bg-netrual flex flex-col space-y-2 bg-neutral text-sm">-->
<!--        <p class="text-sm text-neutral-content/75 uppercase">events</p>-->
<!--        <div class="grid grid-cols-2 lg:grid-cols-6 gap-2">-->
<!--            <button class="btn-sm normal-case rounded btn-accent" on:click={progress(1000)}>+ 1s progress</button>-->
<!--            <button class="btn-sm normal-case rounded btn-accent" on:click={toggleFullscreen}>FullscreenToggle</button>-->
<!--            <button class="btn-sm normal-case rounded btn-accent" on:click={mediaScreenshot}>ScreenshotEvent</button>-->
<!--        </div>-->
<!--    </section>-->

    <section class="p-2 mb-2 bg-netrual flex flex-col space-y-2 bg-neutral text-sm">
        <p class="text-sm text-neutral-content/75 uppercase">toasts</p>
        <div class="grid grid-cols-2 lg:grid-cols-6 gap-2">
            <button class="btn-sm normal-case rounded btn-error" on:click={toastError}>ErrorEvent</button>
            <button class="btn-sm normal-case rounded btn-success" on:click={toastSuccess}>SuccessEvent</button>
        </div>
    </section>


    <div class="space-y-2">
        <DebugAccordion name="queue" value={$service.context.q}/>
        <DebugAccordion name="media" value={$service.context.media}/>
        <DebugAccordion name="track" value={$service.context.track }/>
        <DebugAccordion name="history" value={$service.context.h}/>
        <DebugAccordion name="audio context" value={$service.context.audioContext}/>
        <DebugAccordion name="toast" value={$service.context.toasts}/>
        <DebugAccordion name="timer" value={$service.context.timer}/>
        <DebugAccordion name="states" value={$service.value}/>
        <DebugAccordion name="event" value={$service._event}/>
        <DebugAccordion name="context" value={$service.context}/>
    </div>

    <section class="mb-2 p-2 bg-neutral">
        <p>The media sources for the test scripts exist in 1 or 2 locations which is set in the <code>.env</code> file using <code>PUBLIC_MEDIA_API_URL</code>.</p>
        <ul class="list-disc list-inside">
            <li><a class="link" href="http://mm-media.test">http://mm-media.test</a></li>
            <li><a class="link" href="https://mm-media.netlify.app">https://mm-media.netlify.app</a></li>
        </ul>
    </section>
</div>

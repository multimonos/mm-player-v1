<script>
/**
 * Player.
 *
 * mount : loading > paused > playing > ended
 * error : loading > error
 */
import { createEventDispatcher, onMount } from "svelte"
import { audioPlayer } from "./sketch-player-stores.js";
import Sketch from "./Sketch.svelte"
import Poster from "./player/Poster.svelte";
import Controls from "./player/Controls.svelte";
import ErrorIf from "./player/ErrorIf.svelte";
import LoadingSpinner from "./player/LoadingSpinner.svelte";

// Props.
export let url // es6 Module url


// Constants
const dispatch = createEventDispatcher()
const debug = true
// Player states.
const PS_ERROR = "error"
const PS_LOADING = "loading"
const PS_PLAYING = "playing"
const PS_PAUSED = "paused"
const PS_ENDED = "ended"
// Events.
const E_SKETCH_META = "sketch-meta"
const E_SKETCH_PLAY = "sketch-play"
const E_SKETCH_PAUSE = "sketch-pause"
const E_SKETCH_REPLAY = "sketch-replay"

// Vars.
let module
let meta
let sketchPromise = new Promise( resolve => {} )
let firstPlay = true


// Reactives.
$ : posterUrl = meta && "posterUrl" in meta ? meta.posterUrl : false
$ : meta = module && module.meta ? module.meta : false
// Player
$ : isInteracting = false
$ : showControls = isInteracting || [ PS_PAUSED ].includes( playerState )
// Player State
$ : playerState = url ? PS_LOADING : PS_ERROR
$ : canPlay = () => [ PS_PAUSED ].includes( playerState )
$ : canPause = () => [ PS_PLAYING ].includes( playerState )
$ : canReplay = () => ! firstPlay && [ PS_PLAYING, PS_ENDED, PS_PAUSED ].includes( playerState )
// Error
$ : error = ""

/*
 * Sketch Loading.
 * - always go out and get the sketch module
 * - immediately load the poster with url | backgroundColor
 */
const fetchModule = async url => {
    try {
        const module = await import(/* @vite-ignore */ url)
        return module
    } catch ( e ) {
        return false /* fail silently */
    }
}

const canCreateSketch = module =>
    module && ("createSketch" in module || "sketch" in module)

const createSketch = async module => {

    if ( "createSketch" in module && typeof module.createSketch === "function" ) { // factory
        const sketch = await module.createSketch( {} )
        return sketch

    } else if ( "sketch" in module ) { // vanilla
        const sketch = module.sketch
        return sketch
    }

    return false
}

// Playback controls.
const sendSketchEvent = ( eventName, detail = {} ) => {
    const event = new CustomEvent( eventName, { detail } )
    window.dispatchEvent( event ) // should always be window
    console.log( `player : fired : ${eventName}` )
}

const setPlayerStateOnEvent = ( eventName ) => ( event ) => {
    playerState = eventName
    console.log( `player : received : ${eventName}`, { event } )
}

// Player controls.
const onClickPlay = () => {
    firstPlay = false
    sendSketchEvent( E_SKETCH_PLAY )
}

const onClickPause = () => sendSketchEvent( E_SKETCH_PAUSE )

const onClickReplay = () => sendSketchEvent( E_SKETCH_REPLAY )

const onClickOverlay = e => {
    if ( canPause() ) {
        onClickPause()
    } else if ( canPlay() ) {
        onClickPlay()
    }
}
const onAudioInteractionRequired = () => setPlayerStateOnEvent( PS_PAUSED )

const onAudioPlayerCreated = e => {
    if ( e.detail && "id" in e.detail ) {
        $audioPlayer = window[e.detail.id]
    }
    console.log( "onAudioPlayerCreated :", { $audioPlayer } )
}

// Sketch controls
const onMouseEnter = e => {isInteracting = true}
const onMouseLeave = e => {isInteracting = false}
const noop = () => {}


// Lifecycle.
onMount( async () => {

    if ( ! url ) {
        error = "Missing sketch url."
        return
    }

    module = await fetchModule( url )

    if ( ! canCreateSketch( module ) ) {
        error = "Sketch does not implement the required interface methods."
        return
    }

    meta = module.meta || {}

    sketchPromise = createSketch( module )

    dispatch( E_SKETCH_META, meta )
} )


</script>

<svelte:window
    on:audio-created={onAudioPlayerCreated}
    on:audio-interaction-required={onAudioInteractionRequired}
    on:sketch-playing={setPlayerStateOnEvent(PS_PLAYING)}
    on:sketch-paused={setPlayerStateOnEvent(PS_PAUSED)}
    on:sketch-ended={setPlayerStateOnEvent(PS_ENDED)}
/>

{#if debug}
    <pre>state: {playerState}</pre>
{/if}

<div data-tid="sketch-player"
     data-playerstate={playerState}
     on:mouseenter={onMouseEnter}
     on:mouseleave={onMouseLeave}>

    <div data-tid="sketch-player-wrapper" class="relative w-full">

        <ErrorIf test={error} tid="sketch-player-error" msg={error}/>

        <div data-tid="sketch-player-inner-wrapper"
             on:click={onClickOverlay}
             on:keypress={noop}
             class="relative z-10 flex bg-red-200 justify-center items-center aspect-video">


            {#if canCreateSketch( module )}
                {#await sketchPromise}
                    <Poster url={meta.posterUrl ||  null}/>
                    <LoadingSpinner visible={ [ PS_LOADING ].includes( playerState )}/>
                {:then sketch}
                    <Sketch {sketch}/>
                {/await}
            {/if}
        </div>

        <Controls
            tid="sketch-controls"
            visible={showControls}
            on:play={onClickPlay}
            on:pause={onClickPause}
            on:replay={onClickReplay}
            playEnabled={canPlay()}
            pauseEnabled={canPause()}
            replayEnabled={canReplay()}
        />

    </div>
</div>
<!--<pre>audioPlayer: {$audioPlayer}</pre>-->
<!--<pre>meta: {JSON.stringify( meta, null, 2 )}</pre>-->
<!--<pre>{meta.posterUrl}</pre>-->

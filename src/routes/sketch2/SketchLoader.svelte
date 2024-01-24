<script>

import { createEventDispatcher, onMount } from "svelte"
import Sketch from "./Sketch.svelte"
import { audioPlayer } from "./audio.js";

//props
export let url

// vars
let module
let meta
const dispatch = createEventDispatcher()
$ : playerState = "ready"
$ : posterUrl = meta && meta.posterUrl ? meta.posterUrl : false
$ : meta = module && module.meta ? module.meta : false

// lifecycle
onMount( async () => {
    module = await getModule( url )

    meta = module.meta || {}

    dispatch( "sketch-meta", meta )
} )


// Sketch Load.
const getModule = async url => {
    try {
        const module = await import(/* @vite-ignore */ url)
        return module
    } catch ( e ) {
        return false /* fail silently */
    }
}

const canCreateSketch = module =>
    module && (module.createSketch || module.sketch)

const createSketch = async module => {

    if ( "createSketch" in module ) { // factory
        const sketch = await module.createSketch( {} )
        return sketch

    } else if ( module.sketch ) { // vanilla
        const sketch = module.sketch
        return sketch
    }

    return false
}

// Playback controls.
const onClickPlay = () => {
    $audioPlayer && $audioPlayer.audioContext.state === "suspended" && $audioPlayer.audioContext.resume()
    // a small delay is required to set the audioContext.state, so, it is checkable later
    setTimeout( () => window.dispatchEvent( new Event( "sketch-play" ) ), 50 )
}

const onClickPause = () => {
    $audioPlayer && $audioPlayer.audioContext.state === "suspended" && $audioPlayer.audioContext.resume()
    setTimeout( () => window.dispatchEvent( new Event( "sketch-pause" ) ), 50 )
}

const onClickReplay = () => {
    $audioPlayer && $audioPlayer.audioContext.state === "suspended" && $audioPlayer.audioContext.resume()
    // a small delay is required to set the audioContext.state, so, it is checkable later
    setTimeout( () => window.dispatchEvent( new Event( "sketch-replay" ) ), 50 )
}

const onSketchPlaying = () => {
    playerState = "playing"
}

const onSketchPaused = () => {
    playerState = "paused"
}
const onSketchEnded = () => {
    playerState = "ended"
}

// Audio interaction.
const onAudioInteractionRequired = e => {
    playerState = "paused"
    console.log( "onAudioInteractionRequired: interaction required to resume audio context", e )
}

const onAudioPlayerCreated = e => {
    if ( typeof window === "undefined" ) {
        return
    }

    if ( e.detail && e.detail.id ) {
        $audioPlayer = window[e.detail.id]
    }
    console.log( "onAudioPlayerCreated", { $audioPlayer } )
}
</script>

<svelte:window
        on:audio-created={onAudioPlayerCreated}
        on:audio-interaction-required={onAudioInteractionRequired}
        on:sketch-playing={onSketchPlaying}
        on:sketch-paused={onSketchPaused}
        on:sketch-ended={onSketchEnded}
/>

<br>
<pre>state: {playerState}</pre>

{#if canCreateSketch( module )}
    <div class="sketch-wrapper bg-red-200 " data-playerstate={playerState}>

        <div class="sketch-inner-wrapper relative z-10 flex justify-center items-center aspect-video">

            {#await createSketch( module )}

                <div class="sketch-poster-wrapper flex justify-center">
                    {#if (meta && meta.posterUrl)}
                        <div class="sketch-poster aspect-video">
                            <img src={meta.posterUrl}/>
                        </div>
                    {:else}
                        <div class="sketch-poster--blank flex bg-pink-500">&nbsp;</div>
                    {/if}
                </div>

                <div class="sketch-overlay z-20 absolute inset-0 flex justify-center items-center bg-black/10">
                    <span class="loading loading-infinity loading-lg bg-black"></span>
                </div>

            {:then sketch}
                <div class="sketch-wrapper">

                    <Sketch {sketch}/>
                    <div class="sketch-controls z-30 absolute inset-0 flex justify-center items-center group">

                        {#if [ "ready", "paused" ].includes( playerState ) }
                            <button class="btn btn-circle btn-outline text-black hover:bg-pink-400" on:click={onClickPlay}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path fill="currentColor" d="M8 19V5l11 7zm2-3.65L15.25 12L10 8.65z"/> </svg>
                            </button>
                        {/if}
                        {#if [ "playing" ].includes( playerState ) }
                            <button class="btn btn-circle btn-outline text-black hover:bg-pink-400 hover:visible" on:click={onClickPause}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path fill="currentColor" d="M14 19V5h4v14zm-8 0V5h4v14z"/> </svg>
                            </button>
                        {/if}
                        {#if [ "ended" ].includes( playerState )}
                            <button class="btn btn-circle btn-outline text-black hover:bg-pink-400" on:click={onClickReplay}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22q-1.875 0-3.512-.712t-2.85-1.925q-1.213-1.213-1.925-2.85T3 13h2q0 2.925 2.038 4.963T12 20q2.925 0 4.963-2.037T19 13q0-2.925-2.037-4.962T12 6h-.15l1.55 1.55L12 9L8 5l4-4l1.4 1.45L11.85 4H12q1.875 0 3.513.713t2.85 1.925q1.212 1.212 1.925 2.85T21 13q0 1.875-.712 3.513t-1.925 2.85q-1.213 1.212-2.85 1.925T12 22"/></svg>
                            </button>
                        {/if}
                    </div>

                </div>
            {/await}

        </div>
    </div>
{/if}
<!--<pre>audioPlayer: {$audioPlayer}</pre>-->
<!--<pre>meta: {JSON.stringify( meta, null, 2 )}</pre>-->
<!--<pre>{meta.posterUrl}</pre>-->

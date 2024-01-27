<script>
import { createEventDispatcher } from "svelte";
import Button from "./Button.svelte";

// Props
export let tid
export let visible = false
export let playEnabled = false
export let replayEnabled = false
export let pauseEnabled = false


// Contstants
const dispatch = createEventDispatcher()

// Functions
const play = () => dispatch( "play" )
const pause = () => dispatch( "pause" )
const replay = () => dispatch( "replay" )
</script>

<div data-tid={tid}
     class:hidden={!visible}
     class="absolute z-50 bottom-0 left-0 w-full flex items-center justify-center p-1 bg-black/30">

    <div data-tid={`${tid}-inner`} class="z-30 flex gap-2 justify-center items-center">

        <Button tid="sketch-play-btn" on:click={play} enabled={playEnabled}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M8 19V5l11 7zm2-3.65L15.25 12L10 8.65z"/>
            </svg>
        </Button>

        <Button tid="sketch-pause-btn" enabled={pauseEnabled} on:click={pause}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14 19V5h4v14zm-8 0V5h4v14z"/>
            </svg>
        </Button>

        <Button tid="sketch-replay-btn" enabled={replayEnabled} on:click={replay}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor"
                      d="M12 22q-1.875 0-3.512-.712t-2.85-1.925q-1.213-1.213-1.925-2.85T3 13h2q0 2.925 2.038 4.963T12 20q2.925 0 4.963-2.037T19 13q0-2.925-2.037-4.962T12 6h-.15l1.55 1.55L12 9L8 5l4-4l1.4 1.45L11.85 4H12q1.875 0 3.513.713t2.85 1.925q1.212 1.212 1.925 2.85T21 13q0 1.875-.712 3.513t-1.925 2.85q-1.213 1.212-2.85 1.925T12 22"/>
            </svg>
        </Button>

    </div>
</div>
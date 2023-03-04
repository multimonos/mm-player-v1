<script>
import { createEventDispatcher } from "svelte"

import LoadingButton from "$lib/com/transport/button/LoadingButton.svelte"
import PlayButton from "$lib/com/transport/button/PlayButton.svelte"
import PauseButton from "$lib/com/transport/button/PauseButton.svelte"
import NextButton from "$lib/com/transport/button/NextButton.svelte"
import PreviousButton from "$lib/com/transport/button/PreviousButton.svelte"

// props
export let isLoading = false
export let canPause = false
export let canPlay = false
export let canSkipForward = false
export let canSkipBackward = false

// vars
const dispatch = createEventDispatcher()

// fns
const play = () => dispatch( 'play' )
const pause = () => dispatch( 'pause' )
const skipBackward= () => dispatch( 'skip-backward' )
const skipForward = () => dispatch( 'skip-forward' )
</script>

<PreviousButton on:click={skipBackward} enabled={canSkipBackward}/>

{#if isLoading}
    <LoadingButton/>
{:else if canPause}
    <PauseButton on:click={pause} enabled={canPause}/>
{:else}
    <PlayButton on:click={play} enabled={canPlay}/>
{/if}

<NextButton on:click={skipForward} enabled={canSkipForward}/>
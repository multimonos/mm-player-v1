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
export let canSkipNext = false
export let canSkipPrevious = false

// vars
const dispatch = createEventDispatcher()

// fns
const play = () => dispatch( 'play' )
const pause = () => dispatch( 'pause' )
const skipNext = () => dispatch( 'skip-next' )
const skipPrevious = () => dispatch( 'skip-previous' )
</script>
<PreviousButton on:click={skipPrevious} enabled={canSkipPrevious}/>

{#if isLoading}
    <LoadingButton/>
{:else if canPause}
    <PauseButton on:click={pause} enabled={canPause}/>
{:else}
    <PlayButton on:click={play} enabled={canPlay}/>
{/if}

<NextButton on:click={skipNext} enabled={canSkipNext}/>
<script>
    import Debug from "$lib/Debug.svelte"
    import { onMount } from "svelte"
    import { writable } from "svelte/store"
    import Progress from "./Progress.svelte"
    import ProgressTimer from "./ProgressTimer.svelte"


    const progress = writable( 0 )
    let duration = 7500
    let state = 'ready'


    // ui event handlers
    ////////////////////////////////////////

    const pause = () => {
        if ( ! [ 'playing' ].includes( state ) ) return
        state = 'paused'
    }

    const play = () => {
        if ( ! [ 'ready', 'paused' ].includes( state ) ) return
        state = 'playing'
    }

    const restart = () => {
        state = 'ready'
    }

    onMount( () => {
        console.clear()
    } )
</script>


<Debug>
    state : {state}
    prog : {Math.ceil( $progress )}
</Debug>

<div class="bg-primary-content p-4 w-2/3 mx-auto">

    <Progress value={$progress} max={duration}/>

    <div class="flex justify-center space-x-4">
        <button type="button" class="btn btn-sm btn-primary" on:click={pause}>pause</button>
        <button type="button" class="btn btn-sm btn-primary" on:click={play}>play</button>
        <button type="button" class="btn btn-sm btn-secondary" on:click={restart}>restart</button>
    </div>

    <br>

    <ProgressTimer bind:progress={$progress} {duration} mode={state}/>
</div>


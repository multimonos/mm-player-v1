<script>
    import Debug from "$lib/Debug.svelte"
    import { onMount } from "svelte"
    import { writable } from "svelte/store"
    import Progress from "./Progress.svelte"


    const total = writable( 0 )

    let started = false
    let duration = 20000
    let state = 'ready'
    let sigma = 0

    const update = started => curr => {

        if ( state === "paused" ) {
            sigma = $total

        } else if ( state === 'playing' ) {

            const dt = curr - started
            $total = sigma + dt

            if ( $total < duration ) {
                setTimeout( () => requestAnimationFrame( update( started ) ), 50 )
            }
        }
    }


    // ui event handlers
    ////////////////////////////////////////

    const pause = () => {
        state = 'paused'
    }

    const play = () => {
        if ( state === 'playing' ) return

        if ( 'ready' === state ) {
            state = 'playing'
            started = true
            const startedAt = performance.now()
            update( startedAt )( startedAt + 1 )

        } else if ( state === 'paused' ) {
            state = 'playing'
            const startedAt = performance.now()
            update( startedAt )( startedAt + 1 ) // add a teeny tiny delta bc this is always in the future
        }
    }

    onMount( () => {
        console.clear()
    } )

</script>


<Debug>
    total : {Math.ceil( $total )}
</Debug>

<div class="bg-primary-content p-4 w-2/3 mx-auto">

    <Progress value={$total} max={duration}/>

    <br>

    <div class="flex justify-center space-x-4">
        <button type="button" class="btn btn-sm btn-primary" on:click={pause}>pause</button>
        <button type="button" class="btn btn-sm btn-primary" on:click={play}>play</button>
    </div>
</div>


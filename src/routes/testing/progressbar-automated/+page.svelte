<script>
    /**
     * test Progressbar with a sequenced timeline ... not using the ProgressTimer component
     */
    import Debug from "$lib/Debug.svelte"
    import { onMount } from "svelte"
    import { writable } from "svelte/store"
    import Progress from "../progressbar/Progress.svelte"
    import { timelineControl } from "./timeline-control.js"


    const ceil = a => a.map( Math.ceil ).map( x => new String( x ).padEnd( 6, ' ' ) ).join( '  ' )

    const total = writable( 0 )
    // vars
    ////////////////////////////////////////
    let frame
    let count = 0
    let started = false
    let duration = 20000
    let state = 'ready'
    let debugStart = 0
    let debugEnd = 0
    let sigma = 0
    let dt = 0

    const update = ( started, prev ) => curr => {

        console.log( state.padStart( 12, ' ' ), ':', ceil( [ started, curr, dt, $total ] ) )

        if ( state === "paused" ) {
            sigma = $total

        } else if ( state === 'playing' ) {

            dt = curr - started
            $total = sigma + dt

            if ( $total >= duration ) {
                debugEnd = performance.now()
                console.log( 'total', Math.ceil( $total ) )
                state = 'finished'
                console.log( '/// end' )
            } else {
                setTimeout( () => frame = requestAnimationFrame( update( started ) ), 50 )
            }
        }
    }


    // ui event handlers
    ////////////////////////////////////////

    const pause = () => {
        console.log( '/// paused' )
        state = 'paused'
    }

    const play = () => {
        if ( state === 'playing' ) return

        const startedAt = performance.now()

        if ( 'ready' === state ) {
            debugStart = performance.now() // debug
            console.log( '/// begin' )
            state = 'playing'
            started = true
            update( startedAt )( startedAt )

        } else if ( state === 'paused' ) {
            console.log( '/// resumed' )
            state = 'playing'
            update( startedAt )( startedAt + 1 ) // add a teeny tiny delta bc this is always in the future
        }
    }

    onMount( () => {
        console.clear()

        const s = performance.now()

        const timeline = [
            { time: 2000, fn: play },
            { time: 3000, fn: pause }, // +1
            { time: 4000, fn: play },
            { time: 6000, fn: pause }, // +2
            { time: 7500, fn: play },
            { time: 8500, fn: pause }, // +2
            { time: 13000, fn: play },
            {
                time: 20000, fn: () => {
                    console.log( '/// killed' )
                    state = 'killed'
                }
            },
        ]
        timelineControl( timeline, 0, s )( s )
    } )

    $: debugTime = Math.ceil( debugEnd - debugStart )
</script>


<Debug>
    frame : {frame}
    total : {Math.ceil( $total )}
    debug : {debugTime}
    <!--    played: {played}-->
    <!--    elapsed: {timer.elapsed}-->
</Debug>

<div class="bg-primary-content p-4 w-2/3 mx-auto">

    <p>progress displays only</p>

    <Progress value={$total} max={duration}/>

    <br>

    <div class="flex justify-center space-x-4">
        <button type="button" class="btn btn-sm btn-primary" on:click={pause}>pause</button>
        <button type="button" class="btn btn-sm btn-primary" on:click={play}>play</button>
    </div>
</div>


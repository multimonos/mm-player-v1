<script>
    // props to bind
    import { onMount } from "svelte"

    // props
    export let progress = 0 // ms
    export let duration // ms
    export let mode = 'ready' // ready | playing | paused | completed

    // vars
    const frequency = 50 // ms, how often to recalculate progress
    let acc = 0 // ms, accumulated progress from previous intervals
    let intervalBegin = 0

    // fns
    const update = currentTime => {

        switch ( mode ) {

            case 'ready':
                acc = 0
                progress = 0
                intervalBegin = performance.now()
                break

            case 'playing':
                const dt = currentTime - intervalBegin

                progress = Math.ceil( acc + dt )

                if ( progress >= duration ) {
                    mode = 'completed'
                }
                break

            case 'paused':
                acc = progress
                intervalBegin = performance.now()
                break

            case 'completed':
                // awaiting change of state to ready
                break
        }

        setTimeout( () => requestAnimationFrame( update ), frequency )
    }

    onMount( () => {
        update( performance.now() )
    } )
</script>
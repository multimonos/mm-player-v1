<script>
    // props
    export let value = 0
    export let max = 0

    // fns
    const millisToTime = ms => {
        const total = Math.floor( ms / 1000 )
        const mins = Math.floor( total / 60 )
        const secs = (total - mins * 60)
        return `${ mins.toString().padStart( 2, '0' ) }:${ secs.toString().padStart( 2, '0' ) }`
    }

    // reactives
    $:current = max ? millisToTime( value ) : '∞'
    $:duration = max ? millisToTime( max ) : '∞'
</script>


<div class="flex justify-center items-center p-4 text-center space-x-2">
    <span class="w-16">{current}</span>
    <progress class="progress progress-warning w-56" value={value} max={max}/>
    <span class="w-16">{duration}</span>
</div>

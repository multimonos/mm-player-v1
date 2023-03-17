<script>
export let value = 0
export let max = 0

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

<div id="progress--desktop" class="hidden md:w-full md:flex md:flex-row md:items-center md:gap-2 md:mt-2">
    <small class="w-12 text-end">{current}</small>
    <progress class="progress progress-primary h-1 bg-neutral-200/50 w-100" {value} {max}></progress>
    <small class="w-12">{duration}</small>
</div>
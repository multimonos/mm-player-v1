<script>
export let tracks


const readableDuration = ms => {
    const s = Math.ceil( ms / 1000 )
    return s < 60
        ? `${ s } sec`
        : `${ Math.ceil(s / 60)} min`
}

$: duration = tracks
    .reduce( ( total, track ) => {
        if ( track.media.duration !== false ) {
            total += track.media.duration
        }
        return total
    }, 0 )

</script>
{readableDuration( duration )}
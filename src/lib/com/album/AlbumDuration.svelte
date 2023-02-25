<script>
export let album


const readableDuration = ms => {
    const s = Math.ceil( ms / 1000 )
    return s < 60
        ? `${ s } sec`
        : `${ Math.ceil(s / 60)} min`
}

$: duration = album.tracks
    .reduce( ( total, track ) => {
        if ( track.duration !== false ) {
            total += track.duration
        }
        return total
    }, 0 )

</script>
{readableDuration( duration )}
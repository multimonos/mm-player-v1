<script>
export let data

const fy = ( name, obj ) => {

    return obj
        ? `${ name } : ${ JSON.stringify( obj, null, 4 ) }`
        : `${ name } : not found`
}
</script>

<pre>
    {fy( 'album', data.album )}

    ---

    {fy( 'albums', data.albums )}
</pre>
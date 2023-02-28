export const mediaDestroyService = ( context, event ) => new Promise( async ( resolve, reject ) => {
    // should be used to enter and exit the pipeline, so, that we
    // don't leave any stranded audioContext laying around

    if ( context.media?.ref && context.media.ref.destroy ) {
        context.debug && console.log( 'mediaDestroy - destroying pre-existing media ...' )
        await context.media.ref.destroy?.()
        context.media.ref = null
    } else {
        context.debug && console.log( 'mediaDestroy - nothing here' )
    }

    // context.debug
    //     setTimeout( () => resolve( true ), 3000 )
         resolve( true )
} )
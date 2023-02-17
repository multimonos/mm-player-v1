export const mediaPrepareAsyncService = ( context ) => {
    context.debug && console.log( context.media.params ?? 'no-params-object' )
    const params = context.media.params ?? {}
    return context.media.ref.prepare( { params } )
}
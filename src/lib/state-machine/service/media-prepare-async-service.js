import { isAnyAudioNode } from "standardized-audio-context"
/*
 import { AudioBufferSourceNode } from "standardized-audio-context"


 const createAudioSources = async ( audioContext, urls ) => { // not in use right now
 const responses = await Promise.all( urls.map( url => fetch( url ) ) )
 const arrayBuffers = await Promise.all( responses.map( res => res.arrayBuffer() ) )
 const buffers = await Promise.all( arrayBuffers.map( buf => audioContext.decodeAudioData( buf ) ) )
 const sources = buffers.map( buf => {
 const source = new AudioBufferSourceNode( audioContext ) //.createBufferSource()
 source.buffer = buf
 return source
 } )
 return sources
 }
 */


export const mediaPrepareAsyncService = async ( context ) =>
    new Promise( async ( resolve, reject ) => {

        try {

            // console.log( 'mediaPrepareAsyncService' )

            if ( typeof context.media.prepare === 'function' ) {

                // forward values to sketch's prepare fn
                const params = {
                    ...context.media.params,
                    audioContext: context.audioContext,
                    audioUrl: context.media.audioUrl,
                    duration: context.media.duration,
                }
                const rs = await context.media.prepare( params )

                // resolution ... a few options here
                if ( typeof rs === 'boolean' ) { // no cleanup fn or context to pass along
                    resolve( false )

                } else { // case : return cleanup fn + context object
                    const message = "Doing it wrong : prepare() must return 'false' or an 'object' like { context: {}, destroy: ()=>{} }"

                    if ( ! typeof rs === 'object' )
                        return reject( { message } )

                    if ( rs.hasOwnProperty( 'context' ) && typeof rs.context !== 'object' )
                        return reject( { message } )

                    if ( rs.hasOwnProperty( 'destroy' ) && typeof rs.destroy !== 'function' )
                        return reject( { message } )

                    // use context or empty object
                    const context = rs.hasOwnProperty( 'context' )
                        ? rs.context
                        : {}

                    // use user defined destroy() or make a best guess
                    const destroy = rs.hasOwnProperty( 'destroy' )
                        ? rs.destroy
                        : autoDestroy.bind( context )

                    resolve( { context, destroy } )
                }

            } else {
                // don't do anything
                resolve( false )
            }

        } catch ( e ) {
            console.error( e )
            reject( e )
        }

    } )


/**
 * default method used to try and destroy created audio nodes if the nodes are
 * returned in the 'context' object by prepare()
 */
function autoDestroy() {


    const keys = Object.keys( this )

    console.log( 'auto-destroy' )

    for ( let i = 0; i < keys.length; i++ ) {

        const k = keys[i]

        if ( ! isAnyAudioNode( this[k] ) ) continue


        switch ( this[k].constructor.name ) {
            case 'AudioBufferSourceNode':
                this[k].stop()
                this[k].disconnect()
                this[k] = null
                delete this[k]
                break

            case 'MediaStreamAudioSourceNode':
                this[k].mediaStream && this[k].mediaStream.getAudioTracks().map( t => t.stop && t.stop() )
                break

            case 'AnalyserNode':
                this[k].disconnect()
                this[k] = null
                delete this[k]
                break

            default:
                this[k].disconnect()
                this[k] = null
                delete this[k]
                // console.warn( 'no auto-destroy for node of type', this[i].constructor.name )
                break
        }
    }

    console.log( 'auto-destroy AudioNodes ... killed' )
}

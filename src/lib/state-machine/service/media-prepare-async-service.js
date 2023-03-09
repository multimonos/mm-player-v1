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
            const params = context.media.params ?? {}

            // forward media.params to sketch/media instance
            const cleanupFunctionOrBoolean = await context.media.ref.prepare( {
                params,
                audioContext: context.audioContext
            } )

            // value of result should be a function || boolean
            resolve( cleanupFunctionOrBoolean )

        } catch ( e ) {
            reject( e )
        }

    } )
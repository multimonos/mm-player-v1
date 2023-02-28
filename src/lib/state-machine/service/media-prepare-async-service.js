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
        context.debug && console.log( context.media.params ?? 'no-params-object' )
        const params = context.media.params ?? {}
        await context.media.ref.prepare( { params, audioContext: context.audioContext } )

        return resolve( true )
    } )
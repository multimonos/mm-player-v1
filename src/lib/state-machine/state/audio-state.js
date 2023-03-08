import { isAnyAudioContext } from "standardized-audio-context"
import { IdleState } from "$lib/state-machine/states.js"
import { AudioResumeEvent,AudioPauseEvent } from "$lib/state-machine/events.js"

export const audioState = {
    initial: IdleState,
    states: {
        [IdleState]: {
            on: {
                [AudioPauseEvent]: {
                    actions: ( context ) => {
                        // aggressively create the AudioContext
                        if ( ! isAnyAudioContext( context.audioContext ) ) {
                            context.audioContext = new AudioContext()
                            console.log( AudioPauseEvent, 'AudioContext created', context.audioContext )
                        }

                        if ( isAnyAudioContext( context.audioContext ) && context.audioContext.state === 'running' ) {
                            context.audioContext.suspend()
                            console.log( AudioPauseEvent, 'state=', context.audioContext.state )
                        }
                    }
                },
                [AudioResumeEvent]: {
                    actions: ( context ) => {
                        // NOTE //
                        // It's best to combine the create() + resume() ops into single function, bc, the two calls must occur within ~1sec,
                        // to work for iphone.
                        // We want to call this more times than necessary, so, we always have an available "running" AudioContext.
                        if ( ! isAnyAudioContext( context.audioContext ) ) {
                            context.audioContext = new AudioContext()
                            console.log( AudioResumeEvent, 'AudioContext created', context.audioContext )
                        }

                        if ( isAnyAudioContext( context.audioContext ) && context.audioContext.state === 'suspended' ) {
                            context.audioContext.resume()
                            console.log( AudioResumeEvent, 'state=', context.audioContext.state )
                        }
                    }
                }
            },
        },
    }
}

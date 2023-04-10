import { isAnyAudioContext } from "standardized-audio-context"
import { IdleState } from "$lib/state-machine/states.js"
import { AudioResumeEvent,AudioPauseEvent } from "$lib/state-machine/events.js"

// BUG : chrome does not resume/ stop correctly there is a delay...also, present when using audio inspector

export const audioState = {
    initial: IdleState,
    states: {
        [IdleState]: {
            on: {
                [AudioPauseEvent]: {
                    actions: async ( context ) => {
                        // aggressively create the AudioContext
                        if ( ! isAnyAudioContext( context.audioContext ) ) {
                            context.audioContext = new AudioContext()
                        }

                        if ( isAnyAudioContext( context.audioContext ) && context.audioContext.state === 'running' ) {
                            await context.audioContext.suspend()
                        }
                    }
                },
                [AudioResumeEvent]: {
                    actions: async ( context ) => {
                        // NOTE //
                        // It's best to combine the create() + resume() ops into single function, bc, the two calls must occur within ~1sec,
                        // to work for iphone.
                        // We want to call this more times than necessary, so, we always have an available "running" AudioContext.
                        if ( ! isAnyAudioContext( context.audioContext ) ) {
                            context.audioContext = new AudioContext()
                        }

                        if ( isAnyAudioContext( context.audioContext ) && context.audioContext.state === 'suspended' ) {
                            await context.audioContext.resume()
                        }
                    }
                }
            },
        },
    }
}

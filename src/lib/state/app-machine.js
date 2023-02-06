import { assign, createMachine, send } from "xstate"

// default context
////////////////////
export const defaultContext = {
    track: null,
    q: [],
    h: [],
    fullscreen: false,
    autoplay: false,
}

// events
////////////////////
export const e = {
    PLAY: 'play',
    LOADED: 'loaded',
    ERROR: 'error',
    PAUSE: 'pause',
    RESUME: 'resume',
    PROGRESS: 'progress',
    COMPLETE: 'complete',
    SKIP: 'next',
    BACK: 'previous',
    QUEUE_REPLACE: 'queue.replace',
    QUEUE_APPEND: 'queue.append',
    QUEUE_PREPEND: 'queue.prepend',
    QUEUE_CLEAR: 'queue.clear',
    FULLSCREEN: 'fullscreen.toggle',
    AUTOPLAY: 'autoplay.toggle',
}

// functions
////////////////////
const traceCond = context => {
    console.log( 'trace.cond', context )
    return true
}

const fakeLoadedEvent = { actions: send( { type: e.LOADED, detail: { sketch: 'sketch-foobar' } } ) }
const fakeProgressEvent = { actions: send( { type: e.PROGRESS, detail: { value: 15000 } } ) }

// machine
////////////////////
export const appMachine = createMachine( {
    predictableActionArguments: true,
    type: 'parallel',
    context: defaultContext,
    states: {

        // player
        ////////////////////
        player: {
            initial: "idle",
            states: {
                idle: {
                    // waiting for track to be picked for playback
                    on: {
                        [e.PLAY]: {
                            cond: 'queueNotEmpty',
                            target: "loading",
                        },
                    },
                },

                loading: {
                    // track is preloading, may automatically skip if nothing to preload
                    entry: [ 'assignTrackFromQueue' ],
                    after: { 1500: fakeLoadedEvent },
                    on: {
                        [e.LOADED]: {
                            actions: [ 'assignTrackSketch' ], // sketch from LOADED payload?
                            target: "playing"
                        },
                        [e.ERROR]: { target: "error" },
                    },
                },

                playing: {
                    // track is playing
                    after: { 3000: fakeProgressEvent },
                    on: {
                        [e.PAUSE]: { target: "paused" },
                        [e.PROGRESS]: {
                            actions: [ 'assignElapsed' ]
                        },
                        // [e.SKIP]: { cond: 'queueNotEmpty', actions: [], target: 'loading' },
                        // [e.BACK]: { cond: 'historyNotEmpty', actions: [], target: 'loading' },
                    },
                    always: [
                        {
                            target: 'completed',
                            cond: ( context ) => context.track.elapsed >= context.track.duration
                        }
                    ]
                },

                // autoplaying: {
                //     on: {
                //         [e.PAUSE]: { target: "paused" },
                //         [e.PROGRESS]: { actions: [ 'assignElapsed' ] }
                //     },
                // },

                paused: {
                    // track is paused
                    on: {
                        [e.RESUME]: {
                            target: "playing"
                        },
                    },
                },

                completed: {
                    // track has played to end of duration and playback has stopped
                    entry: [
                        'dequeueFirst', // remove from queue only after complete
                        'historyPrepend', // add to history only after complete
                    ],
                    exit: [
                        'trackDispose' // we don't need this anymore
                    ],
                    on: {
                        [e.COMPLETE]: { target: "loading" },
                    },
                    always: [
                        {
                            cond: context => context.autoplay && context.q.length > 0,
                            target: 'loading',
                        },
                        {
                            // cond: context => context.q.length === 0,
                            target: "idle",
                        }
                    ],
                },

                error: {
                    // something bad happended ...
                },
            },
        },

        // queue
        // //////////////////
        queue: {
            initial: 'ready',
            states: {
                ready: {
                    on: {
                        [e.QUEUE_REPLACE]: {
                            actions: [ 'trace', 'queueReplace' ],
                            target: 'queueing'
                        },
                        [e.QUEUE_APPEND]: {
                            actions: [ 'trace', 'queueAppend' ],
                            target: 'queueing'
                        },
                        [e.QUEUE_PREEND]: {
                            actions: [ 'trace', 'queuePrepend' ],
                            target: 'queueing'
                        },
                        [e.QUEUE_CLEAR]: {
                            actions: [ 'trace', 'queueClear' ],
                            target: 'queueing'
                        }
                    },
                },
                queueing: {
                    always: {
                        target: 'ready',
                        cond: traceCond
                    }
                },
            }
        },

        // fullscreen
        ////////////////////
        fullscreen: {
            initial: 'choice',
            states: {
                choice: {
                    always: [
                        { target: 'enabled', cond: 'fullscreenOn' },
                        { target: 'disabled', cond: 'fullscreenOff' },
                    ]
                },
                enabled: {
                    on: {
                        [e.FULLSCREEN]: {
                            target: 'disabled',
                            actions: 'disableFullscreen'
                        }
                    }
                },
                disabled: {
                    on: {
                        [e.FULLSCREEN]: {
                            target: 'enabled',
                            actions: 'enableFullscreen'
                        }
                    }
                },
            }
        },

        // autoplay
        ////////////////////
        autoplay: {
            initial: 'choice',
            states: {
                choice: {
                    always: [
                        { target: 'enabled', cond: 'autoplayOn' },
                        { target: 'disabled', cond: 'autoplayOff' },
                    ]
                },
                enabled: {
                    on: {
                        [e.AUTOPLAY]: {
                            target: 'disabled',
                            actions: 'disableAutoplay'
                        }
                    }
                },
                disabled: {
                    on: {
                        [e.AUTOPLAY]: {
                            target: 'enabled',
                            actions: 'enableAutoplay'
                        }
                    }
                },
            }
        },

    }

} ).withConfig( {
    guards: {
        'queueNotEmpty': context => context.q.length > 0,
        'historyNotEmpty': context => context.h.length > 0,
        'autoplayOn': context => context.autoplay === true,
        'autoplayOff': context => context.autoplay === false,
        'fullscreenOn': context => context.fullscreen === true,
        'fullscreenOff': context => context.fullscreen === false,
    },

    actions: {
        // trace
        ////////////////////
        trace: ( context, event ) => console.log( 'trace', { context, event } ),
        traceEvent: ( context, event ) => console.log( 'trace', { event } ),

        // queue
        ////////////////////
        queueClear: assign( { q: ( context, event ) => [] } ),
        queueReplace: assign( { q: ( context, event ) => [ ...event.detail.tracks ] } ),
        queueAppend: assign( { q: ( context, event ) => [ ...context.q, ...event.detail.tracks ] } ),
        queuePrepend: assign( { q: ( context, event ) => [ ...event.detail.tracks, ...context.q ] } ),
        dequeueFirst: assign( {
            q: ( context, event ) => {
                const [ _, ...tail ] = context.q
                console.log( { tail } )
                return tail
            }
        } ),

        // history
        ////////////////////
        historyPrepend: assign( {
            h: ( context, event ) => {
                const track = { ...context.track }
                return [ track, ...context.h ]
            }
        } ),

        // fullscreen
        ////////////////////
        enableFullscreen: assign( { fullscreen: ( context, event ) => true } ),
        disableFullscreen: assign( { fullscreen: ( context, event ) => false } ),

        // autoplay
        ////////////////////
        enableAutoplay: assign( { autoplay: ( context, event ) => true } ),
        disableAutoplay: assign( { autoplay: ( context, event ) => false } ),

        // track
        ////////////////////
        trackDispose: assign( { track: ( context, event ) => null } ),
        assignTrackFromQueue: assign( { track: ( context, event ) => ({ ...context.q[0] }) } ),
        assignTrackSketch: assign( {
            track: ( context, event ) => ({ ...context.track, sketch: event.detail.sketch })
        } ),
        assignElapsed: assign( {
            track: ( context, event ) => ({ ...context.track, "elapsed": event.detail.value })
        } )
    },
} )
// export const service = interpret( machine, { devTools: true } )
import { assign, createMachine } from "xstate"

// default context
////////////////////
export const defaultContext = {
    q: [],
    h: [],
    track: null,
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
    NEXT: 'next',
    PREVIOUS: 'previous',
    QUEUE_REPLACE: 'queue.replace',
    QUEUE_APPEND: 'queue.append',
    QUEUE_PREPEND: 'queue.prepend',
    QUEUE_CLEAR: 'queue.clear',
    FULLSCREEN: 'fullscreen.toggle',
    AUTOPLAY: 'autoplay.toggle',
}

// functions
////////////////////
const queueIsNotEmpty = context => context.q.length > 0
const isAutoplay = value => context => context.autoplay === value
const isFullscreen = value => context => context.fullscreen === value
const traceCond = context => {
    console.log( 'trace.cond', context )
    return true
}

// machine
////////////////////
export const appMachine = createMachine( {
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
                            cond: queueIsNotEmpty,
                            target: "loading"
                        },
                    },
                },

                loading: {
                    // track is preloading, may automatically skip if nothing to preload
                    on: {
                        [e.LOADED]: {
                            actions: [ 'trace', 'assignTrack' ],
                            target: "playing"
                        },
                        [e.ERROR]: { target: "error" },
                    },
                },

                playing: {
                    // track is playing
                    on: {
                        [e.PAUSE]: { target: "paused" },
                        [e.COMPLETE]: { target: "completed" },
                        [e.PROGRESS]: { actions: [ 'traceEvent', 'assignElapsed' ] }
                    },
                    always: {
                        target: 'completed',
                        cond: ( context ) => context.track.elapsed >= context.track.duration
                    }
                },

                paused: {
                    // track is paused
                    on: {
                        [e.RESUME]: { target: "playing" },
                    },
                },

                completed: {
                    // track has played to end of duration and playback has stopped
                    on: {
                        [e.COMPLETE]: { target: "loading" },
                    },
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
                        { target: 'enabled', cond: isFullscreen( true ) },
                        { target: 'disabled', cond: isFullscreen( false ) },
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
                        { target: 'enabled', cond: isAutoplay( true ) },
                        { target: 'disabled', cond: isAutoplay( false ) },
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
        loadTrack: () => {
            console.log( "loading track ..." )
            setTimeout( () => console.log( 'foooooooo' ), 500 )
            setTimeout( () => console.log( 'barrrr' ), 1500 )
        },

        assignTrack: assign( {
            track: ( context, event ) => ({ ...context.track, ...event.detail.track }),
        } ),

        assignElapsed: assign( {
            track: ( context, event ) => ({ ...context.track, "elapsed": event.detail.value })
        } )
    },
} )
// export const service = interpret( machine, { devTools: true } )
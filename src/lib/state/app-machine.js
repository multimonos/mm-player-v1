import { assign, createMachine } from "xstate"

// default context
////////////////////
export const defaultContext = {
    track: null,
    q: [],
    h: [],
    progress: 0,
    fullscreen: false,
    autoplay: true,
}

// states
////////////////////
export const s = {
    q_idle: 'q_idle',
    preparing: 'preparing',
    playing: 'playing',
    paused: 'paused',
    completed: 'completed',
    loading: 'loading',
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
    Q_NEXT: 'next',
    Q_PREVIOUS: 'previous',
    Q_REPLACE: 'queue.replace',
    Q_APPEND: 'queue.append',
    Q_PREPEND: 'queue.prepend',
    Q_CLEAR: 'queue.clear',
    FULLSCREEN: 'fullscreen.toggle',
    AUTOPLAY: 'autoplay.toggle',
}

const createMedia = ( { type, url, ref = null } ) => ({ type, url, ref })
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
            id: "player",
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

                initializing: {
                    tags: [ 'loading' ],
                    always: {
                        target: 'loading',
                    }
                },

                loading: {
                    tags: [ 'loading' ],
                    entry: [ 'assignTrackFromQueue', 'progressReset' ],
                    invoke: {
                        id: 'resolveMediaService',
                        src: ( context, event ) =>
                            new Promise( async ( resolve, reject ) => {

                                switch ( context.track.media.type ) {
                                    case "image":
                                        setTimeout( () => {
                                            const media = createMedia( { ...context.track.media } )
                                            media.ref = media.url
                                            resolve( media )
                                        }, 250 )
                                        break

                                    case "p5js":
                                        const haystack = import.meta.glob( `/src/lib/albums/**/*.js` )
                                        const module = haystack[context.track.media.url]
                                        const file = await module()

                                        setTimeout( () => {
                                            const media = createMedia( { ...context.track.media } )
                                            // media.sketch = file.sketch
                                            media.ref = file.sketch
                                            console.log( { media } )
                                            resolve( media )
                                        }, 750 )
                                        break
                                }
                            } ),
                        onDone: {
                            target: 'playing',
                            actions: ( context, event ) => {
                                context.track.media = event.data
                            }
                        }
                    },
                },

                playing: {
                    // track is playing
                    tags: [ 'playing' ],
                    invoke: {
                        id: 'fakeProgress',
                        src: ( context, event ) => ( callback, onReceived ) => {
                            let frame
                            const update = () => {
                                callback( { type: e.PROGRESS, value: 499 } )
                                setTimeout( () => frame = requestAnimationFrame( update ), 750 )
                            }
                            update()
                            return () => cancelAnimationFrame( frame )
                            // const id = setInterval( () => callback( { type: e.PROGRESS, value: 499 } ), 750)
                            // return () => clearInterval( id )
                        }
                    },
                    on: {
                        [e.PAUSE]: { target: "paused" },
                        [e.PROGRESS]: { actions: [ 'progressInc' ] },
                    },
                    always: [
                        {
                            cond: ( context ) => context.progress >= context.track.duration,
                            target: 'completed',
                        },
                    ]
                },

                paused: {
                    // track is paused
                    tags: [ 'playing' ],
                    on: {
                        [e.PLAY]: [ {
                            cond: ( context ) => context.progress < context.track.duration,
                            target: "playing",
                        }, {
                            cond: ( context ) => context.progress >= context.track.duration && context.q.length > 0,
                            target: "loading",
                        } ],
                    },
                },

                completed: {
                    // track has played to end of duration and playback has stopped
                    tags: [ 'playing' ],
                    entry: [
                        'dequeueFirst', // remove from queue only after complete
                        'historyPrepend', // add to history only after complete
                    ],
                    always: [
                        {
                            cond: context => context.autoplay && context.q.length > 0,
                            target: 'loading',
                        },
                        {
                            target: 'paused'
                        }
                    ],
                },

                error: {
                    // something bad happended ...
                },
            },
            on: {
                [e.Q_PREVIOUS]: {
                    cond: 'historyNotEmpty',
                    actions: 'queuePrevious',
                    target: "#player.loading"
                },
                [e.Q_NEXT]: [ {
                    cond: 'queueAtLeastTwo',
                    actions: 'queueNext',
                    target: '#player.loading',
                }, {
                    cond: 'queueHasOne',
                    actions: 'queueNext',
                    target: '#player.idle'
                } ]
            }
        },

        // queue
        // //////////////////
        queue: {
            initial: s.q_idle,
            states: {
                [s.q_idle]: {
                    on: {
                        [e.Q_REPLACE]: {
                            // this is when user "cues and album"
                            actions: [ 'queueReplace' ],
                            target: '#player.loading'
                        },
                        [e.Q_APPEND]: {
                            // usesr adds a track
                            actions: [ 'queueAppend' ],
                            target: s.q_idle
                        },
                        [e.Q_CLEAR]: {
                            // users clears the queue
                            actions: [ 'queueClear' ],
                            target: s.q_idle
                        }
                    },
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

        // anytime events

    }

} ).withConfig( {
    guards: {
        'queueNotEmpty': context => context.q.length > 0,
        'queueHasOne': context => context.q.length === 1,
        'queueAtLeastTwo': context => context.q.length >= 2,
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
        queuePrevious: assign( context => {
            const [ first, ...tail ] = context.h
            context.q = [ first, ...context.q ]
            context.h = [ ...tail ]
            return context
        } ),
        queueNext: assign( context => {
            const [ first, ...tail ] = context.q
            context.q = [ ...tail ]
            context.h = [ first, ...context.h ]
            return context
        } ),
        dequeueFirst: assign( {
            q: ( context, event ) => {
                const [ _, ...tail ] = context.q
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

        // progress
        ////////////////////
        progressReset: assign( { progress: 0 } ),
        progressInc: assign( { progress: ( context, event ) => context.progress + event.value } ),

        // track
        ////////////////////
        assignTrackFromQueue: assign( { track: ( context, event ) => ({ ...context.q[0] }) } ),
    },
} )
// export const service = interpret( machine, { devTools: true } )
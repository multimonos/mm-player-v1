import { assign, createMachine } from "xstate"
import { raise } from 'xstate/lib/actions'
import MediaImage from "$lib/cmp/MediaImage.svelte"
import MediaP5js from "$lib/cmp/MediaP5js.svelte"
import { v4 as uuidv4 } from "uuid"

// fns
////////////////////
const fy = ( o, cnt = 2 ) => JSON.stringify( o, ( key, value ) => value === null ? "null" : value, cnt )
const createMedia = (
    {
        type,
        url,
        component = null,
        componentProps = {},
        ref = null
    } ) => (
    {
        type,
        url,
        component,
        componentProps,
        ref
    })


// default context
////////////////////
export const defaultContext = {
    track: null,
    media: null,
    q: [],
    h: [],
    e: [],
    progress: 0,
    fullscreen: false,
}

// states
////////////////////
export const s = {
    // flat references
    q_ready: 'q_ready',

    // player
    idle: "idle",
    initializing: 'initializing', // choice state, confirm if we can initialize
    initialized: 'initialized', // ready to prepare the media for playback
    preparing: 'preparing', // a waiting state as some media are "more" async than others
    prepared: 'prepared', // ready to play
    loading: 'loading',
    playing: 'playing',
    paused: 'paused',
    completed: 'completed',
    player_loading_begin: `#player.initializing`, // pointer to the first state in loading pipeline
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
    EVOLVE_MEDIA: 'evolvemedia',
}

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
            initial: s.idle,
            states: {
                [s.idle]: {
                    // waiting for track to be picked for playback
                    on: {
                        [e.PLAY]: { target: s.initializing, cond: 'queueNotEmpty' },
                    },
                },

                [s.initializing]: { // choice state that decides if we can initialize
                    tags: [ 'loading' ],
                    always: [
                        { target: s.initialized, cond: 'queueNotEmpty' },
                        { target: s.idle }, // this is just a safety to simplify guards elsewhere
                    ]
                },

                [s.initialized]: { // reset for playback
                    tags: [ 'loading' ],
                    entry: [
                        'progressReset',
                        'mediaReset',
                        'assignTrackFromQueue'
                    ],
                    always: {
                        target: s.preparing,
                    }
                },

                [s.preparing]: {
                    tags: [ 'loading' ],
                    invoke: {
                        id: 'resolveMediaService',
                        src: 'resolveMediaService',
                        onDone: {
                            target: s.playing,
                            actions: [ ( context, event ) => {
                                context.media = event.data
                                console.log( 'reseolvemedia', { event } )
                            } ]//, 'assignMedia' ]
                        },
                        onError: {
                            target: s.idle,
                            actions: raise( { type: e.ERROR, error: { message: 'Unable to resolve media' } } ),
                        }
                    },
                },

                [s.playing]: {
                    // track is playing
                    tags: [ 'playing' ],
                    on: {
                        [e.PAUSE]: { target: s.paused },
                        [e.PROGRESS]: { actions: 'progressInc' },
                        // [e.EVOLVE_MEDIA]: {
                        //     //     cond: 'mediaExists',
                        //     target: s.playing,
                        //     actions: () => {
                        //         console.log( 'got evolve media' )
                        //     }
                        // }
                    },
                    always: [
                        { target: s.completed, cond: 'trackComplete' },
                    ]
                },

                [s.paused]: {
                    // track is paused
                    tags: [ 'playing' ],
                    // entry: [ 'ifMediaP5ThenPause' ],
                    on: {
                        [e.PLAY]: [
                            { target: s.playing, cond: 'trackNotComplete' }, // resume
                            { target: s.initializing, cond: 'trackComplete' } // ? goto next or just replay last
                        ],
                    },
                },

                [s.completed]: {
                    // track has played to end of duration and playback has stopped
                    tags: [ 'playing' ],
                    entry: [
                        'queueRemoveFirst',
                        'historyPrepend',
                    ],
                    always: [
                        { target: s.initializing, cond: 'queueNotEmpty' },
                        { target: s.paused },
                    ],
                },
            },
            on: {
                [e.Q_PREVIOUS]: {
                    target: s.player_loading_begin,
                    cond: 'historyNotEmpty',
                    actions: 'queuePrevious',
                },
                [e.Q_NEXT]: {
                    target: s.player_loading_begin,
                    cond: 'queueNotEmpty',
                    actions: 'queueNext',
                },
            }
        },

        // queue
        // //////////////////
        queue: {
            initial: s.q_ready,
            states: {
                [s.q_ready]: {
                    on: {
                        [e.Q_REPLACE]: {
                            // this is when user "cues and album"
                            target: s.player_loading_begin,
                            actions: [ 'queueReplace' ],
                        },
                        [e.Q_APPEND]: {
                            // usesr adds a track
                            target: s.q_ready,
                            actions: [ 'queueAppend' ],
                        },
                        [e.Q_CLEAR]: {
                            // users clears the queue
                            target: s.q_ready,
                            actions: [ 'queueClear' ],
                        }
                    },
                },
            }
        },

        // error
        ////////////////////
        error: {
            initial: 'idle',
            states: {
                idle: {
                    always: {
                        cond: context => context.e.length > 0,
                        target: 'dequeue',
                    }
                },
                dequeue: {
                    exit: assign( {
                        e: context => {
                            const mark = performance.now()
                            return context.e.filter( e => e.expiresAt > mark )
                        }
                    } ),
                    after: {
                        500: { target: 'idle' }
                    }
                }
            },
            on: {
                [e.ERROR]: {
                    actions: assign( {
                        e: ( context, event ) => {
                            event.error.expiresAt = performance.now() + 4000
                            event.error.id = uuidv4()
                            const e = [ event.error, ...context.e ]
                            return e
                        }
                    } )
                }
            },
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

    }

} ).withConfig( {

    guards: {
        'queueIsEmpty': ( context ) => context.q.length === 0,
        'queueNotEmpty': ( context ) => context.q.length > 0,
        'historyNotEmpty': ( context ) => context.h.length > 0,
        'fullscreenOn': ( context ) => context.fullscreen === true,
        'fullscreenOff': ( context ) => context.fullscreen === false,
        'trackComplete': ( context ) => context.progress >= context.track.duration,
        'trackNotComplete': ( context ) => context.progress < context.track.duration,
        'mediaExists': ( context ) => context.track && context.track.media && typeof context.track.media === 'object',
    },

    actions: {
        // trace
        ////////////////////
        trace: ( context, event ) => console.log( 'trace', { context, event } ),
        traceEvent: ( _, event ) => console.log( 'trace', { event } ),

        // queue
        ////////////////////
        queueClear: assign( { q: [] } ),
        queueReplace: assign( { q: ( _, event ) => [ ...event.detail.tracks ] } ),
        queueAppend: assign( { q: ( context, event ) => [ ...context.q, ...event.detail.tracks ] } ),
        queuePrevious: assign( ( context ) => {
            const [ first, ...tail ] = context.h
            context.q = [ first, ...context.q ]
            context.h = [ ...tail ]
            return context
        } ),
        queueNext: assign( ( context ) => {
            const [ first, ...tail ] = context.q
            context.q = [ ...tail ]
            context.h = [ first, ...context.h ]
            return context
        } ),
        queueRemoveFirst: assign( {
            q: ( context ) => {
                const [ _, ...tail ] = context.q
                return tail
            }
        } ),

        // history
        ////////////////////
        historyPrepend: assign( {
            h: ( context ) => {
                const track = { ...context.track }
                return [ track, ...context.h ]
            }
        } ),

        // fullscreen
        ////////////////////
        enableFullscreen: assign( { fullscreen: true } ),
        disableFullscreen: assign( { fullscreen: false } ),

        // progress
        ////////////////////
        progressReset: assign( { progress: 0 } ),
        progressInc: assign( { progress: ( context, event ) => context.progress + event.value } ),

        // track
        ////////////////////
        assignTrackFromQueue: assign( { track: ( context ) => ({ ...context.q[0] }) } ),
        // assignTrackMedia: assign( { track: ( context, event ) => ({ ...context.track, media: event.data }) } ),

        // media
        ////////////////////
        mediaReset: assign( { media: null } ),
        assignMedia: assign( { media: ( _, event ) => event.data } ),
        // assignMedia: assign({media: ()})
        ifMediaP5ThenPause: ( context ) => {
            console.log( 'if media p5 then pause' )
            // if(context.track.media.type==='p5js' && context.track.media.ref) {
            //     context.track.media.ref.noLoop()
            // }
        },
    },

    services: {
        'resolveMediaService': ( context, event ) =>
            new Promise( async ( resolve, reject ) => {
                switch ( context.track.media.type ) {
                    case "image":
                        setTimeout( () => {
                            const media = createMedia( {
                                ...context.track.media,
                                component: MediaImage,
                                componentProps: { src: context.track.media.url },
                            } )
                            resolve( media )
                        }, 1000 )
                        break

                    case "p5js":
                        const haystack = import.meta.glob( `/src/lib/albums/**/*.js` )
                        const module = haystack[context.track.media.url]
                        const file = await module()

                        setTimeout( async () => {
                            const media = createMedia( {
                                ...context.track.media,
                                component: MediaP5js,
                                componentProps: { sketch: file.sketch },
                            } )
                            resolve( media )

                        }, 3000 )
                        break

                    default:
                        reject( 'unknown media type' )
                        break
                }

            } ),
    }
} )
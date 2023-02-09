import { assign, createMachine } from "xstate"
import { raise } from 'xstate/lib/actions'
import ImageMedia from "$lib/cmp/media/ImageMedia.svelte"
import P5jsMedia from "$lib/cmp/media/P5jsMedia.svelte"
import { v4 as uuidv4 } from "uuid"
import { E_ERROR, E_FULLSCREEN, E_PAUSE, E_PLAY, E_PROGRESS, E_QAPPEND, E_QCLEAR, E_QNEXT, E_QPREVIOUS, E_QREPLACE } from "$lib/state/events"
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
                        [E_PLAY]: { target: s.initializing, cond: 'queueNotEmpty' },
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
                            actions: 'assignMedia',
                        },
                        onError: {
                            target: s.idle,
                            actions: raise( { type: E_ERROR, error: { message: 'Unable to resolve media' } } ),
                        }
                    },
                },

                [s.playing]: {
                    // track is playing
                    tags: [ 'playing' ],
                    on: {
                        [E_PAUSE]: { target: s.paused },
                        [E_PROGRESS]: { actions: 'progressInc' },
                        // [E_EVOLVE_MEDIA]: {
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
                        [E_PLAY]: [
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
                [E_QPREVIOUS]: {
                    target: s.player_loading_begin,
                    cond: 'historyNotEmpty',
                    actions: 'queuePrevious',
                },
                [E_QNEXT]: {
                    target: s.player_loading_begin,
                    cond: 'queueNotEmpty',
                    actions: 'queueNext',
                },
                // [E_EVOLVE]: {
                //     actions: ( context, event ) => {
                //         context.media.ref = event.ref
                //         console.log( 'evolution??', event )
                //     }
                // }
            }
        },

        media: {
            initial: 'ready',
            states: {
                ready: {},
            },
            on: {
                'evolve': {
                    // target: 'mready',
                    actions: ( context, event ) => {
                        console.log( 'got evolve media', { event } )
                    }
                }
            }
        },

        // queue
        // //////////////////
        queue: {
            initial: s.q_ready,
            states: {
                [s.q_ready]: {
                    on: {
                        [E_QREPLACE]: {
                            // this is when user "cues and album"
                            target: s.player_loading_begin,
                            actions: [ 'queueReplace' ],
                        },
                        [E_QAPPEND]: {
                            // usesr adds a track
                            target: s.q_ready,
                            actions: [ 'queueAppend' ],
                        },
                        [E_QCLEAR]: {
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
                        cond: 'errorExists',
                        target: 'dequeue',
                    }
                },
                dequeue: {
                    exit: 'errorRemoveExpired',
                    after: {
                        500: { target: 'idle' }
                    }
                }
            },
            on: {
                [E_ERROR]: {
                    actions: 'errorAdd',
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
                        [E_FULLSCREEN]: {
                            target: 'disabled',
                            actions: 'disableFullscreen'
                        }
                    }
                },
                disabled: {
                    on: {
                        [E_FULLSCREEN]: {
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
        queueIsEmpty: ( context ) => context.q.length === 0,
        queueNotEmpty: ( context ) => context.q.length > 0,
        historyNotEmpty: ( context ) => context.h.length > 0,
        fullscreenOn: ( context ) => context.fullscreen === true,
        fullscreenOff: ( context ) => context.fullscreen === false,
        trackComplete: ( context ) => context.progress >= context.track.duration,
        trackNotComplete: ( context ) => context.progress < context.track.duration,
        errorExists: ( context ) => context.e.length > 0,
        mediaExists: ( context ) => context.track && context.track.media && typeof context.track.media === 'object',
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

        // error
        ////////////////////
        errorRemoveExpired: assign( {
            e: context => {
                const mark = performance.now()
                return context.e.filter( e => e.expiresAt > mark )
            }
        } ),
        errorAdd: assign( {
            e: ( context, event ) => {
                event.error.expiresAt = performance.now() + 4000
                event.error.id = uuidv4()
                const e = [ event.error, ...context.e ]
                return e
            }
        } )
    },


    services: {
        resolveMediaService: ( context, event ) =>
            new Promise( async ( resolve, reject ) => {
                switch ( context.track.media.type ) {
                    case "image":
                        setTimeout( () => {
                            const media = createMedia( {
                                ...context.track.media,
                                component: ImageMedia,
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
                                component: P5jsMedia,
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
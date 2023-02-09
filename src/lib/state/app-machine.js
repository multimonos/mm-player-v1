import { assign, createMachine } from "xstate"
import { raise } from 'xstate/lib/actions'
import ImageMedia from "$lib/cmp/media/ImageMedia.svelte"
import P5jsMedia from "$lib/cmp/media/P5jsMedia.svelte"
import { v4 as uuidv4 } from "uuid"
import { E_ERROR, E_FULLSCREEN, E_PAUSE, E_PLAY, E_PROGRESS, E_QAPPEND, E_QCLEAR, E_QNEXT, E_QPREVIOUS, E_QREPLACE } from "$lib/state/events"
import {
    PlayerCompleted,
    PlayerIdle,
    PlayerInitialized,
    PlayerInitializing,
    PlayerLoadingBegin,
    PlayerPaused,
    PlayerPlaying,
    PlayerPreparing,
    QueueReady,
} from "$lib/state/states.js"


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
            initial: PlayerIdle,
            states: {
                [PlayerIdle]: {
                    // waiting for track to be picked for playback
                    on: {
                        [E_PLAY]: { target: PlayerInitializing, cond: 'queueNotEmpty' },
                    },
                },

                [PlayerInitializing]: { // choice state that decides if we can initialize
                    tags: [ 'loading' ],
                    always: [
                        { target: PlayerInitialized, cond: 'queueNotEmpty' },
                        { target: PlayerIdle }, // this is just a safety to simplify guards elsewhere
                    ]
                },

                [PlayerInitialized]: { // reset for playback
                    tags: [ 'loading' ],
                    entry: [
                        'progressReset',
                        'mediaReset',
                        'assignTrackFromQueue'
                    ],
                    always: {
                        target: PlayerPreparing,
                    }
                },

                [PlayerPreparing]: {
                    tags: [ 'loading' ],
                    invoke: {
                        id: 'resolveMediaService',
                        src: 'resolveMediaService',
                        onDone: {
                            target: PlayerPlaying,
                            actions: 'assignMedia',
                        },
                        onError: {
                            target: PlayerIdle,
                            actions: raise( { type: E_ERROR, error: { message: 'Unable to resolve media' } } ),
                        }
                    },
                },

                [PlayerPlaying]: {
                    // track is PlayerPlaying
                    tags: [ 'playing' ],
                    on: {
                        [E_PAUSE]: { target: PlayerPaused },
                        [E_PROGRESS]: { actions: 'progressInc' },
                        // [E_EVOLVE_MEDIA]: {
                        //     //     cond: 'mediaExists',
                        //     target: PlayerPlaying,
                        //     actions: () => {
                        //         console.log( 'got evolve media' )
                        //     }
                        // }
                    },
                    always: [
                        { target: PlayerCompleted, cond: 'trackComplete' },
                    ]
                },

                [PlayerPaused]: {
                    // track is PlayerPaused
                    tags: [ 'playing' ],
                    // entry: [ 'ifMediaP5ThenPause' ],
                    on: {
                        [E_PLAY]: [
                            { target: PlayerPlaying, cond: 'trackNotComplete' }, // resume
                            { target: PlayerInitializing, cond: 'trackComplete' } // ? goto next or just replay last
                        ],
                    },
                },

                [PlayerCompleted]: {
                    // track has played to end of duration and playback has stopped
                    tags: [ 'playing' ],
                    entry: [
                        'queueRemoveFirst',
                        'historyPrepend',
                    ],
                    always: [
                        { target: PlayerInitializing, cond: 'queueNotEmpty' },
                        { target: PlayerPaused },
                    ],
                },
            },
            on: {
                [E_QPREVIOUS]: {
                    target: PlayerLoadingBegin,
                    cond: 'historyNotEmpty',
                    actions: 'queuePrevious',
                },
                [E_QNEXT]: {
                    target: PlayerLoadingBegin,
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
            initial: QueueReady,
            states: {
                [QueueReady]: {
                    on: {
                        [E_QREPLACE]: {
                            // this is when user "cues and album"
                            target: PlayerLoadingBegin,
                            actions: 'queueReplace',
                        },
                        [E_QAPPEND]: {
                            // usesr adds a track
                            target: QueueReady,
                            actions: 'queueAppend',
                        },
                        [E_QCLEAR]: {
                            // users clears the queue
                            target: QueueReady,
                            actions: 'queueClear',
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
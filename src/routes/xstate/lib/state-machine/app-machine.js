import { assign, createMachine, interpret } from "xstate"
import { raise } from 'xstate/lib/actions'
import { v4 as uuidv4 } from "uuid"
import { resolveMediaService } from "./resolve-media-service.js"
import { debug, delayIfDebug } from "../utils.js"
import {
    ErrorEvent,
    EvolveMediaEvent,
    FullscreenToggleEvent,
    PauseEvent,
    PlayEvent,
    ProgressEvent,
    QueueAppendEvent,
    QueueClearEvent,
    QueueNextEvent,
    QueuePreviousEvent,
    QueueReplaceEvent,
    ScreenshotEvent,
    SuccessEvent
} from "./events.js"
import {
    ChoiceState,
    ClearingState,
    CompletedState,
    DisabledState,
    EnabledState,
    IdleState,
    InitializingState,
    LoopingState,
    PausedState,
    PlayerLoadingBeginState,
    PlayingState,
    PreparedState,
    PreparingAsyncState,
    PreparingState,
    ResolvingState
} from "./states.js"
import { LoadingTag, PlayingTag, RenderableTag } from "./tags.js"


// default context
////////////////////
export const defaultContext = {
    track: null,
    media: null,
    q: [],
    h: [],
    toasts: [],
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
            initial: IdleState,
            states: {
                [IdleState]: { // waiting for queue
                    on: {
                        [PlayEvent]: { target: InitializingState, cond: 'queueNotEmpty' },
                    },
                },

                [InitializingState]: { // choice state ... can we initialize?
                    tags: [ LoadingTag ],
                    exit: [
                        'progressReset',
                        'mediaReset',
                        'assignTrackFromQueue'
                    ],
                    invoke: {
                        id: 'mediaDestroyService',
                        src: 'mediaDestroyService',
                        onDone: [

                            { target: IdleState, cond: 'queueIsEmpty' }, // this is just a safety to simplify guards elsewhere
                            { target: ResolvingState },
                        ]
                    },
                },

                [ResolvingState]: { // where are the things
                    tags: [ LoadingTag ],
                    invoke: {
                        id: 'resolveMediaService',
                        src: 'resolveMediaService',
                        onDone: {
                            target: PreparingState,
                            actions: 'assignMedia',
                        },
                        onError: {
                            target: CompletedState,
                            actions: [
                                'raiseErrorFromEvent',
                                raise( { type: QueueNextEvent } )
                            ],
                        }
                    },
                },

                [PreparingState]: {
                    // stay in this state until we get a reference to the p5jsInstance via EvolveMediaEvent
                    tags: [
                        LoadingTag,
                        RenderableTag // allows p5js sketch to be "created" and mounted to the DOM, so, we can get a ref to it
                    ],
                    always: [
                        { target: PreparedState, cond: context => [ 'image' ].includes( context.media.type ) },
                        { target: PreparingAsyncState, cond: context => context.media.ref && typeof context.media.ref.prepare === 'function' },
                        { target: PreparedState, cond: context => context.media.ref && ! context.media.ref.prepare },
                    ],
                    on: {
                        [EvolveMediaEvent]: {
                            actions: 'assignMediaRef'
                        },
                    }
                },

                [PreparingAsyncState]: {
                    tags: [ LoadingTag, RenderableTag ],
                    invoke: {
                        id: 'prepareAsyncMediaService',
                        src: 'prepareAsyncMediaService',
                        onDone: {
                            target: PreparedState,
                        },
                        onError: {
                            target: CompletedState,
                            actions: [
                                'traceError',
                                'raiseErrorFromEvent',
                            ],
                        }
                    },
                },

                [PreparedState]: {
                    tags: [ LoadingTag, RenderableTag ],
                    always: [
                        { cond: 'trackHasDuration', target: PlayingState },
                        { target: LoopingState }
                    ]
                },

                [LoopingState]: {
                    tags: [ PlayingTag, RenderableTag ],
                    entry: [ 'trace', 'mediaPlay' ],
                },

                [PlayingState]: { // track is playing
                    tags: [ PlayingTag, RenderableTag ],
                    entry: [ 'trace', 'mediaPlay' ],
                    on: {
                        [PauseEvent]: { target: PausedState, },
                        [ProgressEvent]: { actions: 'progressInc' },
                    },
                    always: [
                        { target: CompletedState, cond: 'trackComplete' },
                    ]
                },

                [PausedState]: { // track is paused
                    entry: 'mediaPause',
                    tags: [ PlayingTag, RenderableTag ],
                    on: {
                        [PlayEvent]: [
                            { target: PlayingState, cond: 'trackNotComplete' }, // resume
                        ],
                    },
                },

                [CompletedState]: { // track has played to end of duration and playback has stopped
                    tags: [ PlayingTag, RenderableTag ],
                    entry: [
                        'queueNext',
                    ],
                    invoke: {
                        id: 'mediaDestroyService',
                        src: 'mediaDestroyService',
                        onDone: [
                            { target: InitializingState, cond: 'queueNotEmpty' },
                            { target: PausedState },
                        ]
                    },
                },
            },

            on: {
                [QueuePreviousEvent]: {
                    target: PlayerLoadingBeginState,
                    cond: 'historyNotEmpty',
                    actions: 'queuePrevious',
                },
                [QueueNextEvent]: {
                    target: PlayerLoadingBeginState,
                    cond: 'queueNotEmpty',
                    actions: 'queueNext',
                },
                [ScreenshotEvent]: {
                    actions: 'mediaScreenshot',
                }
            }
        },

        // queue
        // //////////////////
        queue: {
            initial: IdleState,
            states: {
                [IdleState]: {
                    on: {
                        [QueueReplaceEvent]: {
                            // this is when user "cues and album"
                            target: PlayerLoadingBeginState,
                            actions: 'queueReplace',
                        },
                        [QueueAppendEvent]: {
                            // usesr adds a track
                            target: IdleState,
                            actions: 'queueAppend',
                        },
                        [QueueClearEvent]: {
                            // users clears the queue
                            target: IdleState,
                            actions: 'queueClear',
                        }
                    },
                },
            }
        },

        // toasts
        ////////////////////
        toasts: {
            initial: IdleState,
            states: {
                idle: {
                    always: {
                        cond: 'hasToasts',
                        target: ClearingState,
                    }
                },
                [ClearingState]: {
                    exit: 'toastsRemoveExpired',
                    after: {
                        251: { target: IdleState }
                    }
                }
            },
            on: {
                [ErrorEvent]: { actions: [ 'traceError', 'toastsAdd' ] },
                [SuccessEvent]: { actions: [ 'trace', 'toastsAdd' ] },
            },
        },

        // fullscreen
        ////////////////////
        fullscreen: {
            initial: ChoiceState,
            states: {
                [ChoiceState]: {
                    always: [
                        { target: EnabledState, cond: 'fullscreenOn' },
                        { target: DisabledState, cond: 'fullscreenOff' },
                    ]
                },
                [EnabledState]: {
                    on: {
                        [FullscreenToggleEvent]: {
                            target: DisabledState,
                            actions: 'disableFullscreen'
                        }
                    }
                },
                [DisabledState]: {
                    on: {
                        [FullscreenToggleEvent]: {
                            target: EnabledState,
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
        trackHasDuration: ( context ) => context.track?.duration > 0,
        hasToasts: ( context ) => context.toasts.length > 0,
        mediaExists: ( context ) => context.track && context.track.media && typeof context.track.media === 'object',
    },

    actions: {
        // error handling
        ////////////////////
        raiseErrorFromEvent: raise( ( _, event ) => ({ type: ErrorEvent, data: event.data }) ),

        // trace
        ////////////////////
        trace: ( context, event ) => debug( 'trace', { context, event } ),
        traceEvent: ( _, event ) => debug( 'trace', { event } ),
        traceError: ( _, event ) => debug( event ),

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

        // history
        ////////////////////
        historyPrepend: assign( { h: ( context ) => ([ { ...context.track }, ...context.h ]) } ),

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
        assignMedia: assign( { media: ( _, event ) => event.data } ),
        assignMediaRef: assign( { media: ( context, event ) => ({ ...context.media, ref: event.ref }) } ),
        mediaReset: assign( { media: null } ),
        mediaPlay: ( context ) => context.media?.ref?.play?.(),
        mediaPause: ( context ) => context.media?.ref?.pause?.(),
        mediaScreenshot: ( context ) => context.media?.ref?.screenshot?.( context?.track ),

        // toasts
        ////////////////////
        toastsRemoveExpired: assign( {
            toasts: context => {
                const mark = performance.now()
                return context.toasts.filter( toast => toast.data.expiresAt > mark )
            }
        } ),
        toastsAdd: assign( {
            toasts: ( context, event ) => {
                debug( 'toastsAdd', event )
                event.data.expiresAt = performance.now() + 5000
                event.data.id = uuidv4()
                return [ event, ...context.toasts ]
            }
        } )
    },


    services: {
        resolveMediaService,
        prepareAsyncMediaService: ( context ) => {
            debug( context.media.params ?? 'no-params-object' )
            const params = context.media.params ?? {}
            debug( { params } )
            return context.media.ref.prepare( { params } )
        },
        mediaDestroyService: ( context, event ) => new Promise( async ( resolve, reject ) => {
            // should be used to enter and exit the pipeline, so, that we don't leave any
            // stranded audioContext laying around
            if ( context.media?.ref && context.media.ref.destroy ) {
                debug( 'mediaDestroy - destroying pre-existing media ...' )
                await context.media.ref.destroy?.()
                context.media.ref = null
            } else {
                debug( 'mediaDestroy - nothing here' )
            }
            delayIfDebug( () => resolve( true, 2000 ) )
        } ),
    }
} )

export const service = interpret( appMachine ).start()
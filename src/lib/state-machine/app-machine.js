// types of media we can resolve
// deps
import { assign, createMachine, interpret } from "xstate"
import { raise } from 'xstate/lib/actions'
import { v4 as uuidv4 } from "uuid"
import { resolveMediaService } from "$lib/state-machine/resolve-media-service.js"
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
    ScreenshotEvent
} from "$lib/state-machine/events"
import {
    ChoiceState,
    ClearingState,
    CompletedState,
    DisabledState,
    EnabledState,
    IdleState,
    InitializedState,
    InitializingState,
    LoopingState,
    PausedState,
    PlayerLoadingBeginState,
    PlayingState,
    PreparedState,
    PreparingState,
} from "$lib/state-machine/states.js"
import { LoadingTag, PlayingTag } from "$lib/state-machine/tags.js"

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
            initial: IdleState,
            states: {
                [IdleState]: { // waiting for queue
                    on: {
                        [PlayEvent]: { target: InitializingState, cond: 'queueNotEmpty' },
                    },
                },

                [InitializingState]: { // choice state ... can we initialize?
                    tags: [ LoadingTag ],
                    always: [
                        { target: InitializedState, cond: 'queueNotEmpty' },
                        { target: IdleState }, // this is just a safety to simplify guards elsewhere
                    ]
                },

                [InitializedState]: { // reset for playback
                    tags: [ LoadingTag ],
                    entry: [
                        'progressReset',
                        'mediaReset',
                        'assignTrackFromQueue'
                    ],
                    always: {
                        target: PreparingState,
                    }
                },

                [PreparingState]: {
                    tags: [ LoadingTag ],
                    invoke: {
                        id: 'resolveMediaService',
                        src: 'resolveMediaService',
                        onDone: {
                            target: PreparedState,
                            actions: 'assignMedia',
                        },
                        onError: {
                            target: IdleState,
                            actions: [
                                raise( { type: ErrorEvent, error: { message: 'Unable to resolve media' } } ),
                                raise( { type: QueueNextEvent } )
                            ],
                        }
                    },
                },

                [PreparedState]: {
                    always: [
                        { cond: 'trackHasDuration', target: PlayingState },
                        { target: LoopingState }
                    ]
                },

                [LoopingState]: {
                    tags: [ PlayingTag ],
                    entry: [ 'trace', 'mediaPlay' ],
                },

                [PlayingState]: { // track is playing
                    tags: [ PlayingTag ],
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
                    tags: [ PlayingTag ],
                    on: {
                        [PlayEvent]: [
                            { target: PlayingState, cond: 'trackNotComplete' }, // resume
                            { target: InitializingState, cond: 'trackComplete' } // ? goto next or just replay last
                        ],
                    },
                },

                [CompletedState]: { // track has played to end of duration and playback has stopped
                    tags: [ PlayingTag ],
                    entry: [
                        'trace',
                        'queueRemoveFirst',
                        'historyPrepend',
                    ],
                    always: [
                        { target: InitializingState, cond: 'queueNotEmpty' },
                        { target: PausedState },
                    ],
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
                [EvolveMediaEvent]: {
                    actions: 'assignMediaRef'
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

        // error
        ////////////////////
        error: {
            initial: IdleState,
            states: {
                idle: {
                    always: {
                        cond: 'errorExists',
                        target: ClearingState,
                    }
                },
                [ClearingState]: {
                    exit: 'errorRemoveExpired',
                    after: {
                        999: { target: IdleState }
                    }
                }
            },
            on: {
                [ErrorEvent]: {
                    actions: 'errorAdd',
                }
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
        resolveMediaService,
    }
} )

export const service = interpret( appMachine ).start()
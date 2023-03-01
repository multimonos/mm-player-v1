import { PUBLIC_DEBUG } from "$env/static/public"
import { isAnyAudioContext } from "standardized-audio-context"
import { assign, createMachine, interpret } from "xstate"
import { raise } from 'xstate/lib/actions'
import { route } from "$lib/config/routes.js"
import { goto } from "$app/navigation.js"
import { createMedia } from "../model/media-factory.js"
import { mediaResolveService } from "./service/media-resolve-service.js"
import { mediaPrepareAsyncService } from "./service/media-prepare-async-service.js"
import { mediaDestroyService } from "./service/media-destroy-service.js"
import {
    AudioPauseEvent,
    AudioResumeEvent,
    CancelEvent,
    ErrorEvent,
    EvolveMediaEvent,
    FullscreenToggleEvent,
    PauseEvent,
    PlayEvent,
    QueueAppendEvent,
    QueueClearEvent,
    QueueNextEvent,
    QueuePreviousEvent,
    QueueThenPlayEvent,
    ScreenshotEvent,
    SkippingEvent,
    SuccessEvent,
    TimerProgressEvent,
    TimerStartEvent,
    TimerStopEvent
} from "./events.js"
import {
    CancelledState,
    ChoiceState,
    ClearingState,
    CompletedState,
    DisabledState,
    EnabledState,
    IdleState,
    InitializingState,
    LoopingState,
    PausedState,
    PlayingState,
    PreparedState,
    PreparingAsyncState,
    PreparingState,
    ResolvingState,
    TimerIdleState,
    TimerRunningState
} from "./states.js"
import { LoadingTag, PlayingTag, RenderableTag } from "./tags.js"


// default context
////////////////////
export const defaultContext = {
    progress: 0,
    fullscreen: false,
    track: null,
    media: null,
    q: [],
    h: [],
    toasts: [],
    timer: {
        frequency: 50, // ms
        startedAt: 0,
    },
    audioContext: null, // there should only be one
    audioSource: null,
    debug: PUBLIC_DEBUG === 'true',
}


// machine
////////////////////
export const appMachine = createMachine( {
    predictableActionArguments: true,
    type: 'parallel',
    context: defaultContext,
    states: {
        // audio
        ////////////////////
        audio: {
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
        },

        // player
        ////////////////////
        player: {
            id: "player",
            initial: IdleState,
            states: {
                [IdleState]: { // waiting for queue
                    on: {
                        [PlayEvent]: {
                            target: InitializingState,
                            cond: 'queueNotEmpty',
                        },
                    },
                },

                [InitializingState]: { // choice state ... can we initialize?
                    entry: [
                        // () => goto( get( debug ) ? route( '@debug' ) : route( '@player' ) ),
                        () => goto( route( '@player' ) ),
                    ],
                    tags: [ LoadingTag ],
                    invoke: {
                        id: 'mediaDestroyService',
                        src: 'mediaDestroyService',
                        onDone: [
                            { target: IdleState, cond: 'queueIsEmpty' }, // this is just a safety to simplify guards elsewhere
                            { target: ResolvingState },
                        ]
                    },
                    exit: [
                        'progressReset',
                        'mediaReset',
                        'assignTrackFromQueue'
                    ]
                },

                [ResolvingState]: { // where are the things
                    tags: [ LoadingTag ],
                    invoke: {
                        id: 'mediaResolveService',
                        src: 'mediaResolveService',
                        onDone: {
                            target: PreparingState,
                            actions: [ 'assignMedia' ],
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
                    on: {
                        [EvolveMediaEvent]: {
                            actions: 'assignMediaRef'
                        },
                    },
                    always: [
                        { target: PreparedState, cond: context => [ 'image' ].includes( context.media.media_type ) },
                        { target: PreparingAsyncState, cond: context => context.media.ref && typeof context.media.ref.prepare === 'function' },
                        { target: PreparedState, cond: context => context.media.ref && ! context.media.ref.prepare },
                    ]
                },

                [PreparingAsyncState]: {
                    tags: [ LoadingTag, RenderableTag ],
                    invoke: {
                        id: 'mediaPrepareAsyncService',
                        src: 'mediaPrepareAsyncService',
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
                    ],
                },

                [LoopingState]: {
                    tags: [ PlayingTag, RenderableTag ],
                    entry: [ 'mediaPlay' ],
                },

                [PlayingState]: { // track is playing, note audio events should be in event handlers
                    tags: [ PlayingTag, RenderableTag ],
                    entry: [
                        raise( TimerStartEvent ),
                        'mediaPlay',
                    ],
                    exit: [
                        raise( TimerStopEvent )
                    ],
                    on: {
                        [PauseEvent]: { target: PausedState, },
                        [TimerProgressEvent]: { actions: 'progressInc' },
                    },
                    always: [
                        { target: CompletedState, cond: 'trackComplete' },
                    ]
                },

                [PausedState]: { // track is paused, note audio events should be in event handlers
                    entry: [ 'mediaPause', raise( AudioPauseEvent ) ],
                    tags: [ PlayingTag, RenderableTag ],
                    on: {
                        [PlayEvent]: [
                            { // resume
                                target: PlayingState,
                                cond: 'trackNotComplete',
                                actions: [ raise( AudioResumeEvent ) ]
                            },
                            { // track complete + more queue to consume
                                target: InitializingState,
                                cond: context => context.progress >= context.track.duration && context.q.length > 0,
                                actions: [ raise( AudioResumeEvent ) ]
                            },
                            { // track complete + nothing in queue, somethin in history, so, auto-play the most recent history item
                                cond: ( context ) => context.progress >= context.track.duration && context.q.length === 0 && context.h.length > 0,
                                actions: [ raise( QueuePreviousEvent ) ],
                            }
                        ],
                    },
                },

                [CompletedState]: { // track has played to end of duration and playback has stopped
                    tags: [ PlayingTag, RenderableTag ],
                    entry: [
                        raise( 'media:dispose' ),
                        'queueNext',
                    ],
                    always: [
                        { target: InitializingState, cond: 'queueNotEmpty' }, // autoplay
                        { target: PausedState },
                    ],
                    // invoke: {
                    //     id: 'mediaDestroyService',
                    //     src: 'mediaDestroyService',
                    //     onDone: [
                    //         { target: InitializingState, cond: 'queueNotEmpty' },
                    //         { target: PausedState },
                    //     ]
                    // },
                },

                [CancelledState]: {
                    actions: raise( 'media:dispose' ),
                    target: IdleState,
                    // invoke: {
                    //     id: 'mediaDestroyService',
                    //     src: 'mediaDestroyService',
                    //     onDone: [
                    //         { target: IdleState },
                    //     ]
                    // },
                },

                [SkippingEvent]: {
                    entry: [
                        raise( 'media:dispose' ),
                        'assignTrackFromQueue',
                        // raise( AudioPauseEvent ),
                    ],
                    // invoke: {
                    //     id: 'mediaDestroyService',
                    //     src: 'mediaDestroyService',
                    //     onDone: InitializingState,
                    // },
                    after: { 750: InitializingState }, // this needs to be a human interaction type time, but, we must keep the AudioContext alive
                    // after: { 5000: InitializingState },
                }
            },


            on: {
                [QueuePreviousEvent]: {
                    target: `player.${ SkippingEvent }`,
                    cond: 'historyNotEmpty',
                    actions: [ 'queuePrevious', raise( AudioResumeEvent ) ],
                },
                [QueueNextEvent]: {
                    target: `player.${ SkippingEvent }`,
                    cond: context => context.q.length > 1,
                    actions: [ 'queueNext', raise( AudioResumeEvent ) ],
                },
                [CancelEvent]: {
                    target: `player.${ CancelledState }`,
                },
                ['media:dispose']: {
                    actions: context => {
                        if ( context.media.ref ) {
                            const event = new CustomEvent( 'media:destroy', { detail: { ref: context.media.ref } } )
                            window.dispatchEvent( event )
                        }
                    }
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
                        [QueueThenPlayEvent]: {
                            target: IdleState,
                            actions: [
                                raise( AudioResumeEvent ), // this works for audio on iphone and should be here
                                'queueReplace',
                                raise( PlayEvent )
                            ],
                        },
                        [QueueAppendEvent]: {
                            target: IdleState,
                            actions: 'queueAppend',
                        },
                        [QueueClearEvent]: {
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
                [SuccessEvent]: { actions: [ 'toastsAdd' ] },
            },
        },

        // timer
        ////////////////////
        timer: {
            initial: TimerIdleState,
            states: {
                [TimerIdleState]: {
                    on: {
                        [TimerStartEvent]: {
                            actions: context => {
                                // assign() just didn't work here ... ops out of sequence
                                context.timer.startedAt = performance.now()
                                return context
                            },
                            target: TimerRunningState,
                        }
                    }
                },
                [TimerRunningState]: {
                    invoke: {
                        id: 'timerIntervalService',
                        src: context => sendback => {
                            const update = () => {
                                const mark = performance.now()
                                const delta = mark - context.timer.startedAt
                                context.timer.startedAt = mark

                                // external depedency
                                sendback( { type: TimerProgressEvent, delta } )
                            }

                            update()

                            const interval = setInterval( update, context.timer.frequency )

                            return () => {
                                clearInterval( interval )
                            }
                        }
                    },

                    on: { [TimerStopEvent]: { target: TimerIdleState } }
                }
            }
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
        trace: ( context, event ) => context.debug && console.log( 'trace', { context, event } ),
        traceEvent: ( context, event ) => context.debug && console.log( 'trace', { event } ),
        traceError: ( context, event ) => context.debug && console.log( event ),

        // queue + history
        ////////////////////
        queueClear: assign( { q: [] } ),
        queueReplace: assign( { q: ( _, event ) => [ ...event.tracks ] } ),
        queueAppend: assign( { q: ( context, event ) => [ ...context.q, ...event.tracks ] } ),
        queuePrevious: assign( ( context ) => {
            const [ first, ...tail ] = context.h
            context.q = [ first, ...context.q ]
            context.h = [ ...tail ]
            return context
        } ),
        queueNext: assign( ( context ) => {
            const [ first, ...tail ] = context.q
            context.q = [ ...tail ]
            if ( first ) {
                context.h = [ first, ...context.h ]
            }
            return context
        } ),

        // fullscreen
        ////////////////////
        enableFullscreen: assign( { fullscreen: true } ),
        disableFullscreen: assign( { fullscreen: false } ),

        // progress
        ////////////////////
        progressReset: assign( { progress: 0 } ),
        progressInc: assign( { progress: ( context, event ) => context.progress + event.delta } ),

        // current track
        ////////////////////
        assignTrackFromQueue: assign( { track: ( context ) => ({ ...context.q[0] }) } ),

        // media
        ////////////////////
        assignMedia: assign( { media: ( _, event ) => createMedia( event.data ) } ), // @todo remove the dependency on createMedia, it's assumed that the object has been created by now.
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
                context.debug && console.log( 'toastsAdd', event )
                event.data.expiresAt = performance.now() + 5000
                return [ event, ...context.toasts ]
            }
        } )
    },

    services: {
        mediaResolveService,
        mediaPrepareAsyncService,
        mediaDestroyService,
    }
} )

export const service = interpret( appMachine ).start()
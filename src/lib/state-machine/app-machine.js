import { PUBLIC_DEBUG } from "$env/static/public"
import { assign, createMachine, interpret } from "xstate"
import { raise } from 'xstate/lib/actions'
import { route } from "$lib/config/routes.js"
import { goto } from "$app/navigation.js"
import { createMedia } from "../model/media-factory.js"
import { mediaResolveService } from "./service/media-resolve-service.js"
import { mediaPrepareAsyncService } from "./service/media-prepare-async-service.js"
import { initFromLocalStorage } from "$lib/state-machine/service/local-storage-service.js"
import { LoadingTag, PlayingTag, RenderableTag } from "./tags.js"
import { toasterState } from "$lib/state-machine/state/toaster-state.js"
import { audioState } from "$lib/state-machine/state/audio-state.js"
import { fullscreenState } from "$lib/state-machine/state/fullscreen-state.js"
import { timerState } from "$lib/state-machine/state/timer-state.js"
import { localStorageState } from "$lib/state-machine/state/local-storage-state.js"
import {
    AudioPauseEvent,
    AudioResumeEvent,
    CancelEvent,
    EvolveMediaEvent,
    MediaDestroyEvent,
    NotifyEvent,
    PauseEvent,
    PlayEvent,
    PlayQueuedEvent,
    QueueAppendEvent,
    QueueClearEvent,
    QueueReplaceThenPlayEvent,
    QueueThenPlayEvent,
    ScreenshotEvent,
    SkipBackwardEvent,
    SkipForwardEvent,
    TimerProgressEvent,
    TimerStartEvent,
    TimerStopEvent
} from "./events.js"
import {
    CompletedState,
    IdleState,
    InitializingState,
    LoopingState,
    PausedState,
    PlayingState,
    PreparedState,
    PreparingAsyncState,
    PreparingState,
    ResolvingState,
    SkippingState
} from "./states.js"


// default context
////////////////////

export const defaultContext = {
    progress: 0,
    progressBuffer: 25, // ms buffer used to ensure we "complete" a track
    fullscreen: false,
    media: null,
    mediaDestroy: [],
    track: null,//initFromLocalStorage( 'track', null ),
    q: [], //initFromLocalStorage( 'q', [] ),
    h: [], //initFromLocalStorage( 'h', [] ),
    toasts: [],
    timer: {
        frequency: 50, // ms
        startedAt: 0,
    },
    audioContext: null, // there should only be one
    debug: PUBLIC_DEBUG === 'true',
}


// machine
////////////////////
export const appMachine = createMachine( {
    predictableActionArguments: true,
    type: 'parallel',
    context: defaultContext,
    states: {

        // secondary states
        ////////////////////
        toaster: toasterState,
        audio: audioState,
        fullscreen: fullscreenState,
        timer: timerState,
        localStorage: localStorageState,
        // logger: loggerState,

        // player
        ////////////////////
        player: {
            id: "player",
            initial: IdleState,
            states: {
                [IdleState]: { // waiting for queue
                    on: {
                        [PlayEvent]: [
                            {
                                cond: 'queueNotEmpty',
                                actions: [ raise( AudioResumeEvent ) ],
                                target: InitializingState,
                            },
                            {
                                // Nothing in queue, somethin in history, so, queu play the most recent history item and play it
                                // this can happen on page reload() when loading context items from LocalStorage
                                // @todo show a "looks like your session was interrupted message with a big play button"
                                cond: context => context.q.length === 0 && context.h.length > 0,
                                actions: [ 'queuePrevious', raise( AudioResumeEvent ) ],
                                target: InitializingState,
                            }
                        ],
                    },
                },

                [InitializingState]: { // choice state ... can we initialize?
                    entry: [
                        // () => goto( get( debug ) ? route( '@debug' ) : route( '@player' ) ),
                        () => goto( route( '@player' ) ),
                        raise( MediaDestroyEvent ),
                    ],
                    tags: [ LoadingTag ],
                    always: [
                        { target: IdleState, cond: 'queueIsEmpty' },
                        { target: ResolvingState }
                    ],
                    exit: [
                        'progressReset',
                        // 'mediaReset',
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
                            actions: [
                                'traceError',
                                'raiseErrorFromEvent',
                                raise( { type: SkipForwardEvent } )
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
                            actions: 'maybeAddMediaDestroyFunction'

                        },
                        onError: {
                            actions: [
                                'traceError',
                                'raiseErrorFromEvent',
                                raise( { type: SkipForwardEvent } )
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
                    entry: [
                        'mediaPause',
                        raise( AudioPauseEvent )
                    ],
                    tags: [ PlayingTag, RenderableTag ],
                    on: {
                        [PlayEvent]: [
                            { // resume
                                target: PlayingState,
                                cond: 'trackNotComplete',
                                actions: [ raise( AudioResumeEvent ) ]
                            },
                            { // track complete + more queue to consume ... @todo does this ever exist
                                target: InitializingState,
                                cond: context => context.progress >= context.track.duration && context.q.length > 0,
                                actions: [ raise( AudioResumeEvent ) ]
                            },
                            { // track complete + nothing in queue, somethin in history, so, auto-play the most recent history item
                                cond: ( context ) => context.progress >= context.track.duration && context.q.length === 0 && context.h.length > 0,
                                actions: [ raise( SkipBackwardEvent ) ],
                            }
                        ],
                    },
                },

                [CompletedState]: { // track has played to end of duration and playback has stopped
                    tags: [ PlayingTag, RenderableTag ],
                    entry: [
                        raise( MediaDestroyEvent ),
                        'queueNext',
                    ],
                    always: [
                        { target: InitializingState, cond: 'queueNotEmpty' }, // autoplay
                        { target: PausedState },
                    ],
                },

                [SkippingState]: {
                    entry: [
                        raise( MediaDestroyEvent ),
                        'assignTrackFromQueue',
                    ],
                    on: {
                        [SkipBackwardEvent]: { // stay in Skipping state
                            target: SkippingState,
                            cond: 'historyNotEmpty',
                            actions: [ 'queuePrevious', raise( AudioResumeEvent ) ],
                        },
                        [SkipForwardEvent]: { // stay in Skipping state
                            target: SkippingState,
                            cond: context => context.q.length > 1,
                            actions: [ 'queueNext', raise( AudioResumeEvent ) ],
                        },
                    },
                    after: { 750: InitializingState }, // this needs to be a human interaction type time, but, we must keep the AudioContext alive
                },
            },


            on: {
                [PlayQueuedEvent]: {
                    actions: [
                        raise( AudioResumeEvent ),
                        'queueSliceAndPrepend',
                        raise( CancelEvent ),
                        raise( PlayEvent )

                    ]
                },
                [QueueClearEvent]: {
                    actions: 'queueClear',
                },
                [QueueAppendEvent]: {
                    actions: 'queueAppend',
                },
                [QueueThenPlayEvent]: {
                    actions: [
                        raise( AudioResumeEvent ), // this works for audio on iphone and should be here
                        'queuePrepend',
                        raise( PlayEvent ),
                    ],
                },
                [QueueReplaceThenPlayEvent]: {
                    actions: [
                        raise( AudioResumeEvent ), // this works for audio on iphone and should be here
                        'queueReplace',
                        raise( PlayEvent ),
                    ],
                },
                [SkipBackwardEvent]: [
                    { // in the middle of playback
                        target: `player.${ SkippingState }`,
                        cond: context => context.track !== null && context.progress < context.track.duration,
                        actions: [ raise( AudioResumeEvent ) ]
                    },
                    {
                        target: `player.${ SkippingState }`,
                        cond: 'historyNotEmpty',
                        actions: [ 'queuePrevious', raise( AudioResumeEvent ) ],
                    }
                ],
                [SkipForwardEvent]: {
                    target: `player.${ SkippingState }`,
                    cond: context => context.q.length > 1,
                    actions: [ 'queueNext', raise( AudioResumeEvent ) ],
                },
                [CancelEvent]: {
                    actions: [ raise( MediaDestroyEvent ), 'progressReset' ],
                    target: `player.${ IdleState }`,
                },
                [MediaDestroyEvent]: {
                    actions: 'callMediaDestroyFunctions',

                },
                [ScreenshotEvent]: {
                    actions: 'mediaScreenshot',
                }
            }
        },

    }

} ).withConfig( {

    guards: {
        queueIsEmpty: ( context ) => context.q.length === 0,
        queueNotEmpty: ( context ) => context.q.length > 0,
        historyNotEmpty: ( context ) => context.h.length > 0,
        trackComplete: ( context ) => context.progress > context.track.duration + context.progressBuffer,
        trackNotComplete: ( context ) => context.progress < context.track.duration + context.progressBuffer,
        trackHasDuration: ( context ) => typeof context.track.duration === 'number' && context.track.duration > 0,
        mediaExists: ( context ) => context.track && context.track.media && typeof context.track.media === 'object',
    },

    actions: {
        // error handling
        ////////////////////
        raiseErrorFromEvent: raise( ( _, event ) => ({ type: NotifyEvent, status: 'error', message: event.data.message }) ),

        // trace
        ////////////////////
        trace: ( context, event ) => context.debug && console.log( 'trace', { context, event } ),
        traceEvent: ( context, event ) => context.debug && console.log( 'trace', { event } ),
        traceError: ( context, event ) => context.debug && console.log( event ),

        // queue + history
        ////////////////////
        queueClear: assign( { q: ( context ) => [] } ),
        queueReplace: assign( { q: ( _, event ) => [ ...event.tracks ] } ),
        queuePrepend: assign( { q: ( context, event ) => [ ...event.tracks, ...context.q ] } ),
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
        queueSliceAndPrepend: assign( {
            q: ( context, event ) => {
                const n = event.index
                const next = context.q[n] // slice point
                const head = context.q.slice( 0, n )
                const tail = context.q.slice( n + 1 )
                const q = [ next, ...head, ...tail ]
                return q
            }
        } ),

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
        maybeAddMediaDestroyFunction: ( ctx, evt ) => {
            if ( typeof evt.data === 'function' ) {
                ctx.mediaDestroy = [ ...ctx.mediaDestroy, evt.data ]
            }
        },
        callMediaDestroyFunctions: context => {
            if ( context.media?.ref ) {
                // 2 ways to cleanup after each media runs

                if ( context.mediaDestroy.length > 0 ) {
                    // 1) call the sketch's own cleanup method *this is preferred way to cleanup*
                    // ... if a function was returned by mediaPrepareAsyncService and context.mediaDestroy.length > 0
                    context.mediaDestroy.map( fn => {
                        try { // wrap bc we never know how many times the cleanup fn will be called
                            typeof fn === 'function' && fn()
                        } catch ( e ) {
                            // console.error( e )
                        }
                    } )
                    context.mediaDestroy = []

                } else {
                    // 2) send a custom event 'media:destroy' with a reference to the media instance
                    // ... fire the custom 'media:destroy' event that any media can use to dispose of themselves
                    const event = new CustomEvent( MediaDestroyEvent, { detail: { ref: context.media.ref } } )
                    window.dispatchEvent( event )
                }
            }
        }
    },

    services: {
        mediaResolveService,
        mediaPrepareAsyncService,
    }
} )

export const service = interpret( appMachine ).start()


// service.subscribe( svc => {
// } )
import { assign, createMachine } from "xstate"


export const defaultContext = {
    q: [],
    h: [],
    fullscreen: false,
    autoplay: false,
}

const queueIsNotEmpty = context => context.q.length > 0

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
    QUEUE: 'queue',
}

export const appMachine = createMachine( {
    initial: "idle",

    context: defaultContext,

    states: {
        idle: {
            // waiting for track to be picked for playback
            on: {
                [e.PLAY]: {
                    cond: queueIsNotEmpty,
                    target: "loading"
                },
                [e.QUEUE]: {
                    actions: [ 'trace', 'queueReplace' ],
                    target: 'idle'
                }
            },
        },

        queueing: {},
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

    on: {
        [e.NEXT]: { target: "loading" },
        [e.PREVIOUS]: { target: "loading" },
    },
} ).withConfig( {
    actions: {

        trace: ( context, event ) => console.log( 'trace', { context, event } ),
        traceEvent: ( context, event ) => console.log( 'trace', { event } ),

        queueReplace: assign( {
            q: ( context, event ) => event.detail.tracks
        } ),

        queueAppend: () => {

        },
        queuePrepend: () => {

        },
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
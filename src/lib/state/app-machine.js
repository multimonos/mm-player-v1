import { assign, createMachine } from "xstate"

// fns
////////////////////
const createMedia = ( { type, url, ref = null } ) => ({ type, url, ref })


// default context
////////////////////
export const defaultContext = {
    track: null,
    q: [],
    h: [],
    progress: 0,
    fullscreen: false,
}

// states
////////////////////
export const s = {
    // flat references
    q_ready: 'q_ready',
    preparing: 'preparing',
    playing: 'playing',
    paused: 'paused',
    completed: 'completed',
    loading: 'loading',
    idle: "idle",

    // nested references
    player_preparing: '#player.preparing',
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
                        [e.PLAY]: { target: s.preparing, cond: 'queueNotEmpty' },
                    },
                },

                [s.preparing]: {
                    tags: [ 'loading' ],
                    always: [
                        { target: s.loading, cond: 'queueNotEmpty' },
                        { target: s.idle }, // this is just a safety
                    ]
                },

                [s.loading]: {
                    tags: [ 'loading' ],
                    entry: [
                        'progressReset',
                        'assignTrackFromQueue'
                    ],
                    invoke: {
                        id: 'resolveMediaService',
                        src: 'resolveMediaService',
                        onDone: {
                            target: s.playing,
                            actions: [ 'assignTrackMedia' ]

                        }
                    },
                },

                [s.playing]: {
                    // track is playing
                    tags: [ 'playing' ],
                    invoke: {
                        id: 'progressTimer',
                        src: 'progressTimerService',
                    },
                    on: {
                        [e.PAUSE]: { target: s.paused },
                        [e.PROGRESS]: { actions: [ 'progressInc' ] },
                    },
                    always: [
                        { target: s.completed, cond: 'trackComplete' },
                    ]
                },

                [s.paused]: {
                    // track is paused
                    tags: [ 'playing' ],
                    entry: ['ifMediaP5ThenPause'],
                    on: {
                        [e.PLAY]: [
                            { target: s.playing, cond: 'trackNotComplete' }, // resume
                            { target: s.preparing, cond: 'trackComplete' } // ? goto next or just replay last
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
                        { target: s.preparing, cond: 'queueNotEmpty' },
                        { target: s.paused },
                    ],
                },

                error: {
                    // @todo something bad happended ...
                },
            },
            on: {
                [e.Q_PREVIOUS]: {
                    target: s.player_preparing,
                    cond: 'historyNotEmpty',
                    actions: 'queuePrevious',
                },
                [e.Q_NEXT]: {
                    target: s.player_preparing,
                    cond: 'queueNotEmpty',
                    actions: 'queueNext',
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
                        [e.Q_REPLACE]: {
                            // this is when user "cues and album"
                            target: s.player_preparing,
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
        assignTrackMedia: assign( { track: ( context, event ) => ({ ...context.track, media: event.data }) } ),

        // media
        ////////////////////
        ifMediaP5ThenPause: (context)=>{
            console.log('if media p5 then pause')
            // if(context.track.media.type==='p5js' && context.track.media.ref) {
            //     context.track.media.ref.noLoop()
            // }
        },
    },

    services: {
        'resolveMediaService': ( context, event ) => {
            return new Promise( async ( resolve, reject ) => {

                switch ( context.track.media.type ) {
                    case "image":
                        // const media = createMedia( { ...context.track.media } )
                        // const img = new Image()
                        // // img.src = 'https://picsum.photos/2400/1800'
                        // img.src = 'https://media.geeksforgeeks.org/wp-content/uploads/gray.jpeg'
                        // img.onload = () => {
                        //     media.ref = img.src
                        //     console.log( img.src ,{img})
                        //     resolve(media)
                        // }
                        setTimeout( () => {

                            const media = createMedia( { ...context.track.media } )
                            media.ref = media.url
                            resolve( media )
                        }, 3000 )
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

            } )
        },

        'progressTimerService': ( context, event ) => ( callback, onReceived ) => {
            let frame

            const update = () => {
                callback( { type: e.PROGRESS, value: 333 } )
                setTimeout( () => frame = requestAnimationFrame( update ), 250 )
            }

            update()

            return () => cancelAnimationFrame( frame )
        }
    }
} )
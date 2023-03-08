import { TimerIdleState, TimerRunningState } from "$lib/state-machine/states.js"
import { TimerProgressEvent, TimerStartEvent, TimerStopEvent } from "$lib/state-machine/events.js"


export const timerState = {
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

            on: {
                [TimerStopEvent]: { target: TimerIdleState }
            }
        }
    }
}

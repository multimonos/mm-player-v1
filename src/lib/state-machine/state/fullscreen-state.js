import { assign } from "xstate"
import { FullscreenToggleEvent } from "$lib/state-machine/events.js"
import { ChoiceState, DisabledState, EnabledState } from "$lib/state-machine/states.js"


const enableFullscreen = assign( { fullscreen: true } )
const disableFullscreen = assign( { fullscreen: false } )
const fullscreenOn = context => context.fullscreen === true
const fullscreenOff = context => context.fullscreen === false

export const fullscreenState = {
    initial: ChoiceState,
    states: {
        [ChoiceState]: {
            always: [
                { target: EnabledState, cond: fullscreenOn },
                { target: DisabledState, cond: fullscreenOff },
            ]
        },
        [EnabledState]: {
            on: {
                [FullscreenToggleEvent]: {
                    target: DisabledState,
                    actions: disableFullscreen
                }
            }
        },
        [DisabledState]: {
            on: {
                [FullscreenToggleEvent]: {
                    target: EnabledState,
                    actions: enableFullscreen
                }
            }
        },
    }
}

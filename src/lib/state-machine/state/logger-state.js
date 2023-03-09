import { IdleState } from "$lib/state-machine/states.js"


export const loggerState = {
    id: 'logger',
    initial: IdleState,
    states: {
        [IdleState]: {
            after: {
                500: {
                    target: IdleState,
                    actions: [
                        context => console.log( 'mediaDestroy', context.mediaDestroy )
                    ],
                }
            }
        }
    }
}

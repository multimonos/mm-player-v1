import { IdleState } from "$lib/state-machine/states.js"
import { PersistEvent } from "$lib/state-machine/events.js"
import { saveToLocalStorage } from "$lib/state-machine/service/local-storage-service.js"


const frequency = 500 // millis

const persist = context => {
    // console.log('persist called')
    // Cannot just subscribe to the state machine bc context.progress get's updated every
    // context.timer.frequency milliseconds.  At f=50 that's 20 times a second...
    // which is overkill.
    saveToLocalStorage( 'q', context.q )
    saveToLocalStorage( 'h', context.h.slice( 0, 25 ) )
    saveToLocalStorage( 'track', context.track )
}

export const localStorageState = {
    initial: IdleState,
    states: {
        [IdleState]: {
            after: {
                1000: {
                    target: IdleState,
                    actions: persist
                }
            },
            on: {
                [PersistEvent]: {
                    actions: persist
                }
            }
        }
    }
}
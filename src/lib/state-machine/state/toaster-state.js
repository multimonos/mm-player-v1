import { v4 as uuidv4 } from 'uuid'
import { assign, forwardTo } from "xstate"
import { IdleState } from "$lib/state-machine/states.js"

export const NotifyEvent = 'toast:notify'
export const ToastCreateEvent ='toast:create'
export const ToastDeleteEvent ='toast:delete'

export const toasterState = {
    initial: IdleState,
    states: {
        [IdleState]: {
            invoke: {
                id: 'toasterOven',
                src: () => ( sendBack, receive ) => {

                    receive( e => {

                        if ( e.type !== NotifyEvent ) return

                        const toast = {
                            id: uuidv4(),
                            status: e.status,
                            message: e.message,
                        }

                        sendBack( { type: ToastCreateEvent, toast } )

                        setTimeout( () => {
                            sendBack( { type: ToastDeleteEvent, id: toast.id } )
                        }, 5000 )
                    } )
                }
            }
        }
    },
    on: {
        [NotifyEvent]: {
            actions: forwardTo( 'toasterOven' )
        },
        [ToastCreateEvent]: {
            actions: assign( { toasts: ( ctx, evt ) => [ ...ctx.toasts, evt.toast ] } )
        },
        [ToastDeleteEvent]: {
            actions: assign( { toasts: ( ctx, evt ) => ctx.toasts.filter( toast => toast.id !== evt.id ) } )
        }
    }
}

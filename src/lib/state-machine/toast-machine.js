import { assign, createMachine, sendParent } from "xstate"


export const createToastMachine = ( id ) =>
    createMachine( {
        predictableActionArguments: true,
        initial: 'active',
        context: {
            id,
        },
        states: {
            active: {
                // entry: ctx => console.log( 'toaster started', { ctx } ),
                after: {
                    5000: 'cleared'
                }
            },
            cleared: {
                type: 'final',
                data: {
                    foobar: () => 'bam'
                },
                entry: [
                    // ctx => console.log( 'toaster killed', { ctx } ),
                    sendParent( ctx => ({ type: 'toast:remove', id: ctx.id }) )
                ]
            }
        },
    } ).withConfig( {

        guards: {
            isEmpty: context => context.toasts.length = 0,
            hasToasts: context => context.toasts.length > 0,
        },

        actions: {
            trace: ( context, event ) => console.log( { event, context } ),
            traceError: ( _, event ) => console.error( { event, context } ),

            deleteExpired: assign( {
                toasts: context => {
                    const mark = performance.now()
                    return context.toasts.filter( toast => toast.data.expiresAt > mark )
                }
            } ),

            createToast: assign( {
                toasts: ( context, event ) => {
                    // console.log( 'createToast', event )
                    event.data.expiresAt = performance.now() + 2000
                    return [ event, ...context.toasts ]
                }
            } ),
        }
    } )

// export const toastService = interpret( toastMachine ).start()
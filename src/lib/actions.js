import { service } from "$lib/state-machine/app-machine.js"
import {
    PauseEvent,
    PlayEvent,
    QueueReplaceThenPlayEvent,
    QueueThenPlayEvent,
    SkipBackwardEvent,
    SkipForwardEvent
} from "$lib/state-machine/events.js"


export const play = event =>
    service.send( PlayEvent )

export const pause = event =>
    service.send( { type: PauseEvent } )

export const skipForward = event =>
    service.send( { type: SkipForwardEvent } )

export const skipBackward = event =>
    service.send( { type: SkipBackwardEvent } )

export const queueThenPlay = track => event => {
    const tracks = Array.isArray( track ) ? [ ...track ] : [ track ]
    service.send( { type: QueueThenPlayEvent, tracks } )
}

export const queueReplaceThenPlay = track => event => {
    const tracks = Array.isArray( track ) ? [ ...track ] : [ track ]
    service.send( { type: QueueReplaceThenPlayEvent, tracks } )
}
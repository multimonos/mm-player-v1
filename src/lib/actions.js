import { service } from "$lib/state-machine/app-machine.js"
import {
    PauseEvent,
    PlayEvent,
    PlayQueuedEvent,
    QueueAppendEvent,
    QueueClearEvent,
    QueueReplaceThenPlayEvent,
    QueueThenPlayEvent,
    SkipBackwardEvent,
    SkipForwardEvent
} from "$lib/state-machine/events.js"


export const play = event =>
    service.send( PlayEvent )

export const pause = event =>
    service.send( PauseEvent )

export const skipForward = event =>
    service.send( SkipForwardEvent )

export const skipBackward = event =>
    service.send( SkipBackwardEvent )

export const playFromQueue = index => event => {
    service.send( { type: PlayQueuedEvent, index } )
}

export const queue = track => event => {
    const tracks = Array.isArray( track ) ? [ ...track ] : [ track ]
    service.send( { type: QueueAppendEvent, tracks } )
}

export const queueClear = event => {
    service.send( QueueClearEvent )
}

export const queueThenPlay = track => event => {
    const tracks = Array.isArray( track ) ? [ ...track ] : [ track ]
    service.send( { type: QueueThenPlayEvent, tracks } )
}

export const queueReplaceThenPlay = track => event => {
    const tracks = Array.isArray( track ) ? [ ...track ] : [ track ]
    service.send( { type: QueueReplaceThenPlayEvent, tracks } )
}
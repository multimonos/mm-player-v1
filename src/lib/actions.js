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


export const play = () =>
    service.send( PlayEvent )

export const pause = () =>
    service.send( PauseEvent )

export const skipForward = () =>
    service.send( SkipForwardEvent )

export const skipBackward = () =>
    service.send( SkipBackwardEvent )

export const playFromQueue = index => {
    service.send( { type: PlayQueuedEvent, index } )
}

export const queue = track => {
    const tracks = Array.isArray( track ) ? [ ...track ] : [ track ]
    service.send( { type: QueueAppendEvent, tracks } )
}

export const queueClear = () => {
    service.send( QueueClearEvent )
}

export const queueThenPlay = track => {
    const tracks = Array.isArray( track ) ? [ ...track ] : [ track ]
    service.send( { type: QueueThenPlayEvent, tracks } )
}

export const queueReplaceThenPlay = track => {
    const tracks = Array.isArray( track ) ? [ ...track ] : [ track ]
    service.send( { type: QueueReplaceThenPlayEvent, tracks } )
}
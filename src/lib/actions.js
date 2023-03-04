import { service } from "$lib/state-machine/app-machine.js"
import { PauseEvent, PlayEvent, QueueThenPlayEvent, SkipBackwardEvent, SkipForwardEvent } from "$lib/state-machine/events.js"


export const play = event =>
    service.send( PlayEvent )

export const pause = event =>
    service.send( { type: PauseEvent } )

export const skipForward = event =>
    service.send( { type: SkipForwardEvent } )

export const skipBackward = event =>
    service.send( { type: SkipBackwardEvent } )

export const queueManyThenPlay = tracks => event => {
    console.log( { tracks } )
    service.send( { type: QueueThenPlayEvent, tracks: [ ...tracks ] } )
}

export const queueOneThenPlay = track => event => {
    console.log( { track } )
    service.send( { type: QueueThenPlayEvent, tracks: [ track ] } )
}
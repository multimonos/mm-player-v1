// events
////////////////////

// player events
export const PlayEvent = 'player:play'
export const PauseEvent = 'player:pause'
export const ResumeEvent = 'player:resume'
export const ProgressEvent = 'player:progress'
export const CancelEvent = 'player:cancel'
export const EvolveMediaEvent = 'media:evolve'
export const ScreenshotEvent = 'media:screenshot'

// timer events
export const TimerStartEvent = 'timer:start'
export const TimerStopEvent= 'timer:stop'

// queue events
export const QueueNextEvent = 'queue:next'
export const QueuePreviousEvent = 'queue:previous'
export const QueueReplaceEvent = 'queue:replace'
export const QueueAppendEvent = 'queue:append'
export const QueueClearEvent = 'queue:clear'


// other
export const FullscreenToggleEvent = 'fullscreen:toggle'
export const ErrorEvent = 'error'
export const SuccessEvent = 'success'

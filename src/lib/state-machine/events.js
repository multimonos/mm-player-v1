// events
////////////////////

// player events
export const PlayEvent = 'player:play'
export const PauseEvent = 'player:pause'
export const CancelEvent = 'player:cancel'
export const SkipForwardEvent = 'player:skip-forward'
export const SkipBackwardEvent = 'player:skip-backward'

// media
export const MediaDestroyEvent = 'media:destroy'
export const EvolveMediaEvent = 'media:evolve'
export const ScreenshotEvent = 'media:screenshot'

// audio
export const AudioResumeEvent = 'audio:resume'
export const AudioPauseEvent = 'audio:pause'

// timer events
export const TimerStartEvent = 'timer:start'
export const TimerStopEvent = 'timer:stop'
export const TimerProgressEvent = 'timer:progress'

// queue events
export const QueueReplaceEvent = 'queue:replace'
export const QueueThenPlayEvent = 'queue:replaceThenPlay'
export const QueueAppendEvent = 'queue:append'
export const QueueClearEvent = 'queue:clear'

// other
export const FullscreenToggleEvent = 'fullscreen:toggle'
export const PersistEvent = 'persist'

// toast
export const NotifyEvent = 'toast:notify'
export const ToastCreateEvent ='toast:create'
export const ToastDeleteEvent ='toast:delete'
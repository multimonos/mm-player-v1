// state names
////////////////////

// player
export const IdleState = "idle"
export const InitializingState = 'initializing' // choice state confirm if we can initialize
export const InitializedState = 'initialized' // ready to prepare the media for playback
export const PreparingState = 'preparing' // a waiting state as some media are "more" async than others
export const PreparingAsyncState = 'preparingAsync' // a waiting state as some media are "more" async than others
export const ResolvingState = 'resolving' // find the media
export const PreparedState = 'prepared'
export const PlayingState = 'playing'
export const LoopingState = 'looping'
export const PausedState = 'paused'
export const CompletedState = 'completed'

// compound references
export const PlayerLoadingBeginState = `#player.${InitializingState}` // pointer to the first state in PlayerLoading pipeline

// fullscreen
export const EnabledState = 'enabled'
export const DisabledState = 'disabled'
export const ChoiceState = 'choice'

// error
export const ClearingState = 'toasts:clearing'
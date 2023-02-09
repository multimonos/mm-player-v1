// state names
////////////////////

// flat references
export const QueueReady = 'q_ready'

// player
export const PlayerIdle = "idle"
export const PlayerInitializing = 'initializing' // choice state confirm if we can initialize
export const PlayerInitialized = 'initialized' // ready to prepare the media for playback
export const PlayerPreparing = 'preparing' // a waiting state as some media are "more" async than others
export const PlayerPrepared = 'prepared' // ready to play
export const PlayerLoading = 'loading'
export const PlayerPlaying = 'playing'
export const PlayerPaused = 'paused'
export const PlayerCompleted = 'completed'

// compound references
export const PlayerLoadingBegin = `#player.initializing` // pointer to the first state in PlayerLoading pipeline
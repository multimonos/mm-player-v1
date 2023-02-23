import { testTracks } from "../src/lib/test/test-tracks.js"


export const States = {
    player: state => `[data-tid="player-state--${ state }"]`,
}

export const Transport = {
    root: '[data-tid="transport"]',
    play: '[data-tid="play-btn"]',
    next: '[data-tid="skip-next-btn"]',
    previous: '[data-tid="skip-previous-btn"]',
    pause: '[data-tid="pause-btn"]',
    loading: '[data-tid="loading-btn"]',
}

export const Tracks = testTracks.reduce( ( dict, item ) => ({
    ...dict,
    [item.id]: `[data-tid="q-${ item.id }"]`
}), {} )

export const Queue = {
    state: name => `[data-tid="queue-state--${ name }"]`,
    button: '[data-tid="queue-btn"]',
    root: '[data-tid="queue"]',
    items: '[data-tid="queue-item"]',
    empty: '[data-tid="queue-empty"]',
}

export const History = {
    root: '[data-tid="history"]',
    items: '[data-tid="history-item"]',
    empty: '[data-tid="history-empty"]',
}

export const NowPlaying = {
    root: '[data-tid="now-playing"]',
    items: '[data-tid="now-playing-item"]',
    empty: '[data-tid="now-playing-empty"]',
}

export const Toasts = {
    state: name => `[data-tid="toasts-state--${ name }"]`,
}


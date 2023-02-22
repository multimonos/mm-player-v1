import { testTracks } from "../src/lib/test/test-tracks.js"


export const States = {
    player: state => `[data-cy="player-state--${ state }"]`,
}

export const Transport = {
    root: '[data-cy="transport"]',
    play: '[data-cy="play-btn"]',
    next: '[data-cy="skip-next-btn"]',
    previous: '[data-cy="skip-previous-btn"]',
    pause: '[data-cy="pause-btn"]',
    loading: '[data-cy="loading-btn"]',
}

export const Tracks = testTracks.reduce( ( dict, item ) => ({
    ...dict,
    [item.id]: `[data-cy="q-${ item.id }"]`
}), {} )

export const Queue = {
    state: name => `[data-cy="queue-state--${ name }"]`,
    root: '[data-cy="queue"]',
    items: '[data-cy="queue-item"]',
    empty: '[data-cy="queue-empty"]',
}

export const History = {
    root: '[data-cy="history"]',
    items: '[data-cy="history-item"]',
    empty: '[data-cy="history-empty"]',
}

export const NowPlaying = {
    root: '[data-cy="now-playing"]',
    items: '[data-cy="now-playing-item"]',
    empty: '[data-cy="now-playing-empty"]',
}

export const Toasts = {
    state: name => `[data-cy="toasts-state--${ name }"]`,
}


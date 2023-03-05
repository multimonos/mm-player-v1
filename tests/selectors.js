import { albums } from "../src/routes/api/albums.js"


export const States = {
    // player: state => `[data-player-state="${ state }"]`,
    player: `[data-tid="player-state"]`,
}

export const Player = {
    dataState: name => `[data-player-state="${ name }"]`,
    state: `[data-tid="player-state"]`,
}

export const Transport = {
    root: '[data-tid="transport"]',
    play: '[data-tid="play-btn"]',
    next: '[data-tid="skip-next-btn"]',
    previous: '[data-tid="skip-previous-btn"]',
    pause: '[data-tid="pause-btn"]',
    loading: '[data-tid="loading-btn"]',
}

// @todo "albums" is a weird dependency
export const Tracks = albums
    .find( album => album.slug === 'test-cases-happy-path' ).tracks
    .reduce( ( dict, item ) => ({
        ...dict,
        [item.slug]: `[data-tid="q-${ item.slug }"]`
    }), {} )

export const Queue = {
    state: name => `[data-queue-state="${ name }"]`,
    dataCount: n => `[data-queue-count="${ n }"]`,
    count: '[data-tid="queue-count"]',
    button: '[data-tid="queue-btn"]',
    root: '[data-tid="queue"]',
    items: '[data-tid="queue-item"]',
    empty: '[data-tid="queue-empty"]',
}

export const History = {
    root: '[data-tid="history"]',
    // count: n => `[data-history-count="${ n }"]`,
    count: '[data-tid="history-count"]',
    items: '[data-tid="history-item"]',
    empty: '[data-tid="history-empty"]',
}

export const NowPlaying = {
    root: '[data-tid="now-playing"]',
    count: `[data-tid="now-playing-count"]`,
    name: `[data-tid="current-track-name"]`,
    items: '[data-tid="now-playing-item"]',
}

export const Toasts = {
    state: name => `[data-toasts-state="${ name }"]`,
    // count: n => `[data-toasts-count="${ n }"]`,
    count: '[data-tid="toasts-count"]',
}

export const Audio = {
    state: `[data-tid="audio-context-state"]`,
}

// Pages
export const SharePage = {
    playButton: `[data-tid="play-shared"]`
}

export const AlbumPage = {
    playTrackButton: `[data-tid="play-track-btn"]`,
    playAlbumButton: `[data-tid="play-album-btn"]`,
}
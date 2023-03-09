export const album = {
    slug: "test-audio",
    album_type: "album",
    name: "Audio Test Case",
    bg_color: null,
    images: [
        { url: "https://res.cloudinary.com/multimonos/image/upload/w_900,h_900/multimonos/covers/test-audio-cover.jpg" }
    ],
    artists: [ 'multimonos' ],
    tracks: [
        {
            name: "Western diamonback [1]",
            media: {
                media_type: 'p5js',
                url: `PUBLIC_MEDIA_URL/test/audio-parameterized.bundle.js`,
                params: {
                    audioUrl: "https://res.cloudinary.com/multimonos/video/upload/v1618331761/audio/animals/bbc_western-di_nhu0510004.mp3"
                }
            }
        },
        {
            name: "Wolf sample [2]",
            media: {
                media_type: 'p5js',
                url: `PUBLIC_MEDIA_URL/test/audio-parameterized.bundle.js`,
                params: {
                    audioUrl: "https://res.cloudinary.com/multimonos/video/upload/v1612041823/audio/animals/wolf.mp3"
                }
            }
        },
        {
            name: "Frog sample [3]",
            media: {
                media_type: 'p5js',
                url: `PUBLIC_MEDIA_URL/test/audio-parameterized.bundle.js`,
                params: { audioUrl: 'https://res.cloudinary.com/multimonos/video/upload/v1618331080/audio/animals/bbc_snoring-pu_nhu0501912.mp3' }
            }
        },
        {
            name: "Them miner beeezz [4]",
            media: {
                media_type: 'p5js',
                url: `PUBLIC_MEDIA_URL/test/audio-parameterized.bundle.js`,
                params: {
                    audioUrl: "https://res.cloudinary.com/multimonos/video/upload/v1618331759/audio/animals/bbc_solitary-m_nhu0504315.mp3"
                }
            }
        },
    ]
}


const createMedia = audioUrl => ({
    media_type: 'p5js',
    url: `PUBLIC_MEDIA_URL/sketch/coldwave-moonrise/audio.bundle.js`,
    params: {
        audioUrl
    }
})

export const album = {
    slug: "coldwave-moonrise",
    album_type: "album",
    name: "Coldwave Moonrise",
    bg_color: null,
    images: [
        { url: "https://res.cloudinary.com/multimonos/image/upload/w_900,h_900/multimonos/covers/coldwave-moonrise-01.jpg" }
    ],
    artists: [ 'multimonos' ],
    tracks: [
        {
            name: "Western diamonback [1]",
            media: createMedia( "https://res.cloudinary.com/multimonos/video/upload/v1618331761/audio/animals/bbc_western-di_nhu0510004.mp3" )
        },
        {
            name: "Toad sample",
            media: createMedia( 'https://res.cloudinary.com/multimonos/video/upload/v1618331073/audio/animals/bbc_giant-toad_nhu0501904.mp3' )
        },
        {
            name: "Wolf sample [2]",
            media: createMedia( "https://res.cloudinary.com/multimonos/video/upload/v1612041823/audio/animals/wolf.mp3" )
        },
        {
            name: "Frog sample [3]",
            media: createMedia( 'https://res.cloudinary.com/multimonos/video/upload/v1618331080/audio/animals/bbc_snoring-pu_nhu0501912.mp3' )
        },
        {
            name: "Them miner beeezz [4]",
            media: createMedia( "https://res.cloudinary.com/multimonos/video/upload/v1618331759/audio/animals/bbc_solitary-m_nhu0504315.mp3" )
        },
    ]
}
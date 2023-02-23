export const album = {
    id: "test-rgb",
    album_type: "album",
    name: "Demo RGB",
    bg_color: "from-[#9A8A78]",
    images: [
        { url: "https://res.cloudinary.com/multimonos/image/upload/t_mm_album_cover/v1674956892/multimonos/covers/flower-cover.jpg" }
    ],
    artists: [ 'multimonos', 'multimonos' ],
    tracks: [
        { media: { media_type: "p5js", url: "https://mm-media.netlify.app/sketch/demo/red.bundle.js" } },
        { media: { media_type: "p5js", url: "https://mm-media.netlify.app/sketch/demo/green.bundle.js" } },
        { media: { media_type: "p5js", url: "https://mm-media.netlify.app/sketch/demo/blue.bundle.js" } },
    ],
}
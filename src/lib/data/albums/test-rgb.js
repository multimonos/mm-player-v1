export const album = {
    slug: "test-rgb",
    album_type: "album",
    name: "Demo RGB",
    bg_color: "from-[#9A8A78]",
    images: [
        { url: "https://res.cloudinary.com/multimonos/image/upload/w_900,h_900/multimonos/covers/flower-cover.jpg" }
    ],
    artists: [ 'multimonos', 'multimonos' ],
    tracks: [
        { media: { media_type: "p5js", url: "PUBLIC_MEDIA_URL/sketch/demo/red.bundle.js" } },
        { media: { media_type: "p5js", url: "PUBLIC_MEDIA_URL/sketch/demo/green.bundle.js" } },
        { media: { media_type: "p5js", url: "PUBLIC_MEDIA_URL/sketch/demo/blue.bundle.js" } },
    ],
}
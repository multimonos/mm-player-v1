export const album = {
    slug: "test-rainbow",
    name: "Rainbow",
    album_type: "compilation",
    artists: [ 'multimonos' ],
    bg_color: "from-[#E86670]",
    images: [
        { url: "https://res.cloudinary.com/multimonos/image/upload/t_mm_album_cover/multimonos/covers/rainbow-cover.jpg" }
    ],
    tracks: [
        { media: { media_type: "p5js", url: "PUBLIC_MEDIA_URL/sketch/demo/red.bundle.js" } },
        { media: { media_type: "p5js", url: "PUBLIC_MEDIA_URL/sketch/demo/orange.bundle.js" } },
        { media: { media_type: "p5js", url: "PUBLIC_MEDIA_URL/sketch/demo/yellow.bundle.js" } },
        { media: { media_type: "p5js", url: "PUBLIC_MEDIA_URL/sketch/demo/green.bundle.js" } },
        { media: { media_type: "p5js", url: "PUBLIC_MEDIA_URL/sketch/demo/blue.bundle.js" } },
        { media: { media_type: "p5js", url: "PUBLIC_MEDIA_URL/sketch/demo/indigo.bundle.js" } },
        { media: { media_type: "p5js", url: "PUBLIC_MEDIA_URL/sketch/demo/violet.bundle.js" } },
    ],
}
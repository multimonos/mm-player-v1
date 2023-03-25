export const mediaProjection = `
    '_type': 'media',
    media_type,
    'url': select(
        media_type == 'p5js'  => p5js_url,
        media_type == 'image' => image.asset->url,
        null
    ),
    'params': select(
        audio_url != null => { 'audioUrl': audio_url },
        null
    )
`
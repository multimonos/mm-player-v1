export const heroProjection = `
    'eyebrow': hero.eyebrow,
    'title':   hero.title,
    'tagline': hero.tagline,
    'image': { 
        'url': hero.image.asset->url 
    }
`
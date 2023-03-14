import { site } from "$lib/config/site.js"

export const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": site.name,
    "url": site.url,
    "keywords": site.keywords,
    "description":site.description,
    "sameAs": [
        "https://github.com/multimonos",
        "https://www.instagram.com/multimonos/",
        "https://twitter.com/multimonos",
    ]
}
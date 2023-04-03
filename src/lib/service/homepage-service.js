import { client } from "$lib/service/sanity-client.js"
import { heroProjection } from "$lib/service/groq/hero.js"
import { albumProjection } from "$lib/service/groq/album.js"


export const getHomepage = () => {

    const query = `*[_type == "home" && active == true][0]{
        'hero': { ${heroProjection} },
        'featured_albums': featured_albums[]->{ ${albumProjection} }
    }`

    // console.log(query)

    return client.fetch( query )
}

import { client } from "$lib/service/sanity-client.js"
import { heroProjection } from "$lib/service/groq/hero.js"


export const getHomepage = () => {

    const query = `*[_type == "home" && active == true][0]{
        'hero': { ${heroProjection} }
    }`
console.log(query)
    return client.fetch( query )
}

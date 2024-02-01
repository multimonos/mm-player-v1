import { PUBLIC_SKETCH_API_BASEURI } from "$env/static/public";

export const sketchurl = path => {
    return `${PUBLIC_SKETCH_API_BASEURI}${path}`
}
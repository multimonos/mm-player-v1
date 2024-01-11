
import { PUBLIC_SKETCH_API_BASEURI } from "$env/static/public"



export const load = async ( { params } ) => {

    return {
        BASEURI_API: PUBLIC_SKETCH_API_BASEURI
    }

}
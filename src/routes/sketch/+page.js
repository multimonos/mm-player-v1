
import { PUBLIC_API_BASEURI } from "$env/static/public"



export const load = async ( { params } ) => {

    return {
        BASEURI_API: PUBLIC_API_BASEURI
    }

}
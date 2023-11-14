
import { PUBLIC_MEDIA_API_URL } from "$env/static/public"



export const load = async ( { params } ) => {

    return {
        MEDIA_API_URL: PUBLIC_MEDIA_API_URL
    }

}
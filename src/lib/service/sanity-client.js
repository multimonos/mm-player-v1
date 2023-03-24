import { PUBLIC_SANITY_PROJECT_ID } from "$env/static/public"
import { createClient } from "@sanity/client"


export const client = createClient( {
    projectId: PUBLIC_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2021-10-21',
    useCdn: false
} )

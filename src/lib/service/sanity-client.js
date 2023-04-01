// @see https://www.youtube.com/watch?v=xp1vT8ES8wQ
import { PUBLIC_SANITY_PROJECT_ID } from "$env/static/public"
import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"


export const client = createClient( {
    projectId: PUBLIC_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2021-10-21',
    useCdn: false
} )


// image url builder
const imageBuilder = imageUrlBuilder( client )

export const isSanityImage = obj =>
    obj !== null
    && typeof obj === 'object'
    && obj._type && obj._type === 'image'
    && obj.asset

export const imageUrl = ( source, xform = {} ) =>
    isSanityImage( source )
        // apply sanity transforms
        ? Object.keys( xform ).reduce( ( o, k ) => {
            return o = o[k]( xform[k] )
        }, imageBuilder.image( source ) )
        // return original url
        : source
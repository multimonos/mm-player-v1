import { PUBLIC_URL } from "$env/static/public"
import { client } from "$lib/service/sanity-client.js"


const createTrackQuery = ( { where = '' } = {} ) => {

    // @see album-service.js for identical node
    const query = `*[_type=='track' ${ where }]{
        _id,
        "type": _type,                
        name,
        duration,
        
        "links" : {
            "self": "${ PUBLIC_URL }/api/tracks/" + _id,            
            "share": "${ PUBLIC_URL }/share/multimonos:track:" +_id,
        },   
    
        // @see album-service.js for identical node 
        "media": {
             "type": "media",
             media_type,
             "url": select(
                 media_type == 'p5js' => p5js_url,
                 media_type == 'image' => image.asset->url,
                 null, 
             ),
             "params": select(
                 audio_url != null => {"audioUrl": audio_url},
                 null 
             ),
        },
        

        // @see album-service.js for identical node 
        "album": *[_type=="album" && references(^._id)][0]{
            _id,
            "type": _type,
            album_type,
            "slug": slug.current,
            name,
            "poster": {
                 "url": poster.asset->url
            },
            "links" : {
                "self": "${ PUBLIC_URL }/api/albums/" + _id,            
                "share": "${ PUBLIC_URL }/share/multimonos:album:" +_id,
                "href": "${ PUBLIC_URL }/albums/" + slug.current        
            },   
        }
    }`
    return query
}

export const trackFindMany = ( options = {} ) => {
    const query = createTrackQuery( options )
    return client.fetch( query )
}

export const trackFindUnique = ( field, value ) =>
    new Promise( async ( resolve, reject ) => {
        try {
            // very common mappings
            if ( field === 'slug' ) field = 'slug.current'
            if ( field === 'id' ) field = '_id'

            // build query
            const options = { where: `&& ${ field } == "${ value }"` }
            const query = createTrackQuery( options )

            const rs = await client.fetch( query )
            // console.log({rs})

            return rs.length === 1
                ? resolve( rs[0] )
                : resolve( null ) // nothing valid found

        } catch ( e ) {
            reject( e )
        }
    } )

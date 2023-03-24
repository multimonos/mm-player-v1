import { PUBLIC_URL } from "$env/static/public"
import { client } from "$lib/service/sanity-client.js"


const createAlbumQuery = ( { where = '' } = {} ) => {

    const query = ` *[_type=='album' ${ where }]{
        _id,
        _type,                
        "slug" : slug.current,   
        album_type,
        name,
        
        "poster": {
            "url": poster.asset->url
        },       
        images,
        
        "links" : {
            "self": "${ PUBLIC_URL }/api/albums/" + _id,            
            "share": "${ PUBLIC_URL }/share/multimonos:album:" +_id,
            "href": "${ PUBLIC_URL }/albums/" + slug.current        
        },   
        
        tracks[]->{ 
            _id, 
            _type,
            name, 
            duration,
            
            // @see track-service.js for identical node 
            "media": {
                 "_type": "media",
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
            
            "links" : {
                "self": "${ PUBLIC_URL }/api/tracks/" + _id,            
                "share": "${ PUBLIC_URL }/share/multimonos:track:" +_id,
            },
            
            // @see track-service.js for identical node 
            "album": {
                "_id": ^._id,
                "_type": ^._type,
                "album_type": ^.album_type,
                "slug": ^.slug.current,
                "name": ^.name,
                "poster": {
                     "url": ^.poster.asset->url
                },
                "links" : {
                    "self": "${ PUBLIC_URL }/api/albums/" + ^._id,            
                    "share": "${ PUBLIC_URL }/share/multimonos:album:" + ^._id,
                    "href": "${ PUBLIC_URL }/albums/" + ^.slug.current        
                },                 
            }
        },        
    }`
    return query
}

export const albumFindMany = ( options = {} ) => {
    const query = createAlbumQuery( options )
    return client.fetch( query )
}


export const albumFindUnique = ( field, value ) =>
    new Promise( async ( resolve, reject ) => {
        try {
            // very common mappings
            if ( field === 'slug' ) field = 'slug.current'
            if ( field === 'id' ) field = '_id'

            // build query
            const options = { where: `&& ${ field } == "${ value }"` }
            const query = createAlbumQuery( options )

            const rs = await client.fetch( query )
            // console.log({rs})

            return rs.length === 1
                ? resolve( rs[0] )
                : resolve( null ) // nothing valid found

        } catch ( e ) {
            reject( e )
        }
    } )

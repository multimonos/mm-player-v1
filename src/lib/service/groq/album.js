import { PUBLIC_URL } from "$env/static/public"


export const albumProjection = `
 _id,
_type,                
"slug" : slug.current,   
album_type,
name,
poster,
"images": coalesce([], images),

"links" : {
    "self": "${ PUBLIC_URL }/api/albums/" + _id,            
    "tracks": "${ PUBLIC_URL }/api/albums/" + _id + "/tracks",            
    "share": "${ PUBLIC_URL }/share/multimonos:album:" +_id,
    "href": "${ PUBLIC_URL }/albums/" + slug.current        
},   

// TRACKS
tracks[]{ 
    _key,
    _type,
    name, 
    duration,
   
    // MEDIA
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
        "self": "${ PUBLIC_URL }/api/albums/"+ ^._id +"/tracks/"+ _key,            
        "share": "${ PUBLIC_URL }/share/multimonos:track:"+ ^._id +":"+ _key
    },
    
    // TRACK.ALBUM
    "album": {
        "_id": ^._id,
        "_type": ^._type,
        "album_type": ^.album_type,
        "slug": ^.slug.current,
        "name": ^.name,
        "poster":  ^.poster,
        "links" : {
            "self": "${ PUBLIC_URL }/api/albums/" + ^._id,            
            "share": "${ PUBLIC_URL }/share/multimonos:album:" + ^._id,
            "href": "${ PUBLIC_URL }/albums/" + ^.slug.current        
        },                 
    }
},        
`
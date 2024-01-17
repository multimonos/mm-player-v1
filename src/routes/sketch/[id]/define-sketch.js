/*
 - tracks.length >= 1
 */

//
// make the sketch config code based
//

// the player should just
// - get the sketch by slug which is the filename
// - get the track to load
//
// this can all be done with a simple trackUri with structure of,
// - <sketchSlug>:<trackID>

// the queue just gets tracks
// enqueue just adds a bunch of trackUri to a list

/* params schema when describing a parameter ...
 schema:
 name: "audioUrl"
 type: string
 enum:
 - audioUrl0
 - audioUrl1
 - audioUrl2
 */
export const defineMeta= (
    {
        // name = "", // not necessary as the filename is id which is a slug
        id = "", // a slug unique to this sketch
        type = "p5js",
        params = [], // use defineParam()
        tracks = [], // use defineTrack()
    }
) => (
    {
        id,
        type,
        params,
        tracks,
    }
)

export const defineParam = (
    {
        name = "p0",
        type = "string",
        values = [],
    }
) => (
    {
        name,
        type,
        values,
    }
)


const makeParam = (
    { name = "", value = "" }
) => (
    { name, value }
)

export const defineTrack = (
    {
        id = "001", // a hash or some kind of string unique to this sketch ...immutable
        name = "track0", // mutable string
        params = [], // use makeParam() ... defines the unique value of a sketch parameter
        duration = false, // milliseconds or falsy for no duration
        imageUrl = "", // not required
    }
) => (
    {
        id,
        name,
        params,
        duration,
        imageUrl,
    }
)
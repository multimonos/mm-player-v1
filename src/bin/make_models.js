#!/usr/bin/env node
import glob from 'glob'
import fs from 'fs'
import { createAlbum } from "../lib/model/album-factory.js"
import { createTrack, createTrackAlbum } from "../lib/model/track-factory.js"
import { createArtist } from "../lib/model/artist-factory.js"
import { users } from "../lib/data/users.js" // not a generated model


console.log( 'cwd', process.cwd() )


const jsonStringifyReplacer = ( key, value ) =>
    typeof value === 'undefined' ? null : value

const stringify = o =>
    JSON.stringify( o, jsonStringifyReplacer )

const realpath = sveltekitPath =>
    `${ process.cwd() }${ sveltekitPath }`.replace( /\/{2,}/, '/' )

const write = ( str, dst ) =>
    fs.writeFileSync( dst, str )

const jsonArrayToExportSyntax = ( varname, jsonString ) =>
    jsonString.replace( /^\s*\[/, `export const ${ varname } = [` )

const importMany = async paths => {
    const modules = await Promise.all( paths.map( p => import(p) ) )
    const objs = modules.map( module => module.album )
    return objs
}

const evolveArtists = users => obj => {
    // create lookup
    const lookup = users.reduce( ( list, u ) => ({ ...list, [u.id]: u }), {} )

    // replace each userId with an Artist
    const artists = obj.artists.map( uid => createArtist( lookup[uid] ) )

    return { ...obj, artists }
}

const evolveTrack = async track => {
    // console.log( { track } )

    // update url in track.media if necessary
    track.media.url = track.media.url.replace( 'PUBLIC_MEDIA_URL', 'https://mm-media.netlify.app' )

    let ntrack

    // p5js medias
    if ( track.media.media_type === 'p5js' ) {
        const module = await import(track.media.url)
        const meta = module.meta
        ntrack = createTrack( { ...track, ...meta } )

    } else { // other types, like 'image'
       ntrack = createTrack({...track})
    }
    // console.log( { ntrack } )

    return ntrack
}

const evolveTrackAlbum = album => obj => {
    // create lookup
    // const lookup = albums.reduce( ( list, u ) => ({ ...list, [u.id]: u }), {} )
    obj.album = createTrackAlbum( album )
    return obj
}


/////////////////////////////////////


/**
 * generate the albums.js file
 */
const makeAlbumModels = async ( users ) => {
    const globber = realpath( `/src/lib/data/albums/*.js` )
    const paths = glob.sync( globber )
    const data = await importMany( paths )
    const albums = data
        .map( createAlbum )
        .map( evolveArtists( users ) )

    // add tracks
    for ( const album of albums ) {
        // destructive / modify in place
        album.tracks = await Promise.all( album.tracks.map( evolveTrack ) )

        // evolve the track with "some" of the album data
        album.tracks = album.tracks.map( evolveTrackAlbum( album ) )
    }

    return albums
}


const main = async () => {
    const albums = await makeAlbumModels( users )
    const jsonString = stringify( albums )
    // console.log(jsonString)
    const str = jsonArrayToExportSyntax( 'albums', jsonString )
    console.log( str )
    write( str, `${ process.cwd() }/src/routes/api/albums/albums.js` )
}

console.log( 'making models ...' )
await main()
console.log( 'done' )
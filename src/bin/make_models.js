#!/usr/bin/env node
import glob from 'glob'
import fs from 'fs'
import md5 from 'md5'
import { createAlbum } from "../lib/model/album-factory.js"
import { createTrack, createTrackAlbum } from "../lib/model/track-factory.js"
import { createArtist } from "../lib/model/artist-factory.js"
import { users } from "../lib/data/users.js" // not a generated model

// env variables
const ENV = process.env.NODE_ENV || 'production'
const MEDIA_URL = ENV === 'development' ? 'http://mm-media.test' : 'https://mm-media.netlify.app'
const APP_URL = ENV === 'development' ? 'http://localhost:5173' : 'https://mm-sandbox.netlify.app'
// const MEDIA_URL = 'https://mm-media.netlify.app'
// process.exit(0)

// console.log( 'cwd', process.cwd() )

const jsonStringifyReplacer = ( key, value ) =>
    typeof value === 'undefined' ? null : value

const stringify = o =>
    JSON.stringify( o, jsonStringifyReplacer, 2 )

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

const evolveAlbum = album => {
    const id = md5( album.slug )
    const uri = `multimonos:albums:${ id }`

    return createAlbum( {
        ...album,
        id,
        links: {
            self: `${ APP_URL }/api/albums/${ id }`,
            href: `${ APP_URL }/albums/${ album.slug }`,
            share: `${ APP_URL }/open/${ uri }`
        }
    } )
}

const getTrackMeta = async ( url ) => {
    // glob or remote import?
    const isRemote = Array.isArray( url.match( /^https?:/ ) )
    console.log( { url, isRemote } )

    if ( isRemote ) {
        const module = await import(url) // this requires `node --experimental-network-imports`
        return module.meta

    } else {
        const path = realpath(url) // the url should be relative to app route, so, mediaResolveService() can find it later
        const module = await import(path)
        return module.meta
    }
}

const evolveTrack = async track => {
    // console.log( { track } )

    // update url in track.media, so, we can test remote and locally
    track.media.url = track.media.url.replace( 'PUBLIC_MEDIA_URL', MEDIA_URL )

    let ntrack

    // p5js medias
    if ( track.media.media_type === 'p5js' ) {

        console.log( 'url', track.media.url )
        const meta = await getTrackMeta( track.media.url )
        const id = md5( meta.slug )
        const uri = `mulitmonos:tracks:${ id }`

        ntrack = createTrack( {
            ...meta,
            ...track,
            id, // @todo the cms should manage this eventually
            links: {
                self: `${ APP_URL }/api/tracks/${ id }`,
                share: `${ APP_URL }/open/${ uri }`
            }
        } )

    } else { // other types, like 'image'

        const id = md5( track.slug )
        const uri = `mulitmonos:tracks:${ id }`

        ntrack = createTrack( {
            ...track,
            id, // @todo the cms should manage this eventually
            links: {
                self: `${ APP_URL }/api/tracks/${ id }`,
                share: `${ APP_URL }/open/${ uri }`
            }
        } )
    }

    return ntrack
}

const evolveTrackAlbum = album => obj => {
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
        .map( evolveAlbum )
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
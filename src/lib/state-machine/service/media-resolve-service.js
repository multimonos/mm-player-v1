// types of media we can resolve
import ImageMedia from "../../com/media/ImageMedia.svelte"
import P5jsMedia from "../../com/media/P5jsMedia.svelte"


export const mediaResolveService = ( context, event ) =>

    new Promise( async ( resolve, reject ) => {

        switch ( context.track.media.media_type ) {

            case "image":
                const media = {
                    ...context.track.media,
                    component: ImageMedia,
                }

                context.debug
                    ? setTimeout( () => resolve( media ), 3000 )
                    : resolve( media )
                break


            case "p5js":
                try {
                    if ( context.track.media.url.includes( 'http' ) ) { // case 1: a remote sketch url
                        const { sketch, prepare, meta } = await import(/* @vite-ignore */context.track.media.url)
                        const media = {
                            ...context.track.media,
                            component: P5jsMedia,
                            sketch,
                            prepare,
                        }

                        context.debug
                            ? setTimeout( () => resolve( media ), 3000 )
                            : resolve( media )

                    } else { // case 2: sketching a file within this codebase
                        const haystack = import.meta.glob( `/src/routes/sketch/sketches/**/*.js` )

                        if ( ! haystack[context.track.media.url] ) {
                            reject( `sketch "${ context.track.media.url }" not found` )
                        }

                        const module = haystack[context.track.media.url]

                        const { sketch, meta, prepare } = await module()

                        const media = {
                            ...context.track.media,
                            component: P5jsMedia,
                            sketch,
                            prepare,
                        }

                        resolve( media )
                    }

                } catch ( e ) {
                    console.error(e)
                    reject( e )
                }
                break

            default:
                reject( { message: `Unknown media type: ${ context.track.media?.media_type } ` } )
                break
        }
    } )

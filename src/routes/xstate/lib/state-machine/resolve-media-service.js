import { createMedia } from "./media-factory.js"
import { delayIfDebug } from "../utils.js"
import {debug} from "../utils.js"
// types of media we can resolve
import ImageMedia from "../cmp/media/ImageMedia.svelte"
import P5jsMedia from "../cmp/media/P5jsMedia.svelte"


export const resolveMediaService = ( context, event ) =>
    new Promise( async ( resolve, reject ) => {

        switch ( context.track.media.type ) {

            case "image":
                delayIfDebug( () => {
                    const media = createMedia( {
                        ...context.track.media,
                        component: ImageMedia,
                        componentProps: { src: context.track.media.url },
                    } )
                    resolve( media )
                }, 1000 )
                break

            case "p5js":
                try {
                    let componentProps

                    if ( context.track.media.url.includes( 'http' ) ) { // absolute urls
                        const { sketch, meta } = await import(/* @vite-ignore */context.track.media.url)
                        componentProps = { sketch }
                        debug( { sketch, meta } )
                    } else { // project urls with glob
                        const haystack = import.meta.glob( `/src/lib/media/test/**/*.js` )
                        const module = haystack[context.track.media.url]
                        const file = await module()
                        debug( { haystack, module, file } )
                        componentProps = { sketch: file.sketch }
                    }

                    delayIfDebug( async () => {
                        const media = createMedia( {
                            ...context.track.media,
                            component: P5jsMedia,
                            componentProps,
                        } )
                        resolve( media )

                    }, 3000 )

                } catch ( e ) {
                    reject( e )
                }
                break

            default:
                reject( { message: `Unknown media type: ${ context.track.media?.type } ` } )
                break
        }
    } )

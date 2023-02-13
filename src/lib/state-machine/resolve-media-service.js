import { createMedia } from "$lib/state-machine/media-factory.js"
// types of media we can resolve
import ImageMedia from "$lib/cmp/media/ImageMedia.svelte"
import P5jsMedia from "$lib/cmp/media/P5jsMedia.svelte"


export const resolveMediaService = ( context, event ) =>
    new Promise( async ( resolve, reject ) => {

        switch ( context.track.media.type ) {

            case "image":
                setTimeout( () => {
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

                    // const haystack = import.meta.glob( `/src/lib/albums/**/*.js` )
                    // const module = haystack[context.track.media.url]
                    // const file = await module()
                    // console.log( { haystack,module,file } )

                    const { sketch, meta } = await import(context.track.media.url)
                    console.log( { sketch, meta } )


                    setTimeout( async () => {
                        const media = createMedia( {
                            ...context.track.media,
                            component: P5jsMedia,
                            // componentProps: { sketch: file.sketch },
                            componentProps: { sketch },
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

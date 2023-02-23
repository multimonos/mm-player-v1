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
                    componentProps: { src: context.track.media.url },
                }

                context.debug
                    ? setTimeout( () => resolve( media ), 3000 )
                    : resolve( media )
                break


            case "p5js":
                try {
                    if ( context.track.media.url.includes( 'http' ) ) { // case 1: a url
                        const { sketch, meta } = await import(/* @vite-ignore */context.track.media.url)
                        const media = {
                            ...context.track.media,
                            component: P5jsMedia,
                            componentProps: { sketch },
                        }

                        context.debug
                            ? setTimeout( () => resolve( media ), 3000 )
                            : resolve( media )

                    } else { // case 2: a file within this codebase
                        const haystack = import.meta.glob( `/src/lib/media/test/**/*.js` )
                        const module = haystack[context.track.media.url]
                        const file = await module()
                        const media = {
                            ...context.track.media,
                            component: P5jsMedia,
                            componentProps: { sketch: file.sketch },
                        }

                        if ( context.debug ) {
                            setTimeout( () => resolve( media ), 3000 )
                        } else {
                            resolve( media )
                        }
                    }

                } catch ( e ) {
                    reject( e )
                }
                break

            default:
                reject( { message: `Unknown media type: ${ context.track.media?.type } ` } )
                break
        }
    } )

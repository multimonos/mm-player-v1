import { writable } from "svelte/store"


export const createShareable = (
    {
        modalTitle='Share',
        url = '',
        image = '',
        title = '',
        message = '',

    }
) => (
    {
        modalTitle,
        // used for all networks
        url: encodeURI( url ),
        image,
        title,
        message,
    }
)

// stores
/** toggles display of the share modal */
export const shareIsVisible = writable( false )

/** current data for shareable object */
export const shareable = writable( createShareable( {} ) )

// fns
export const hideSharing = () => shareIsVisible.set( false )

export const resetShareable = () => shareable.set( createShareable( {} ) )

export const share = async data => {

    const nativeShareData = {
        url: data.url,
        title: data.title,
        text: data.message,
    }

    if ( navigator.canShare) {
        console.log('share: native')
        await navigator.share(nativeShareData)
    } else {
        console.log('share: manual')
        shareable.set( createShareable( { ...data } ) )
        shareIsVisible.set( true )
    }
}
// @see https://www.youtube.com/watch?v=hyZQLQITeV4&t=304s

const DATALAYER_EVENTS = [
    'play_album',
    'play_track',
    'share_album',
    'share_track',
]

const sendDataLayerEvent = ( event, data ) => {

    if ( ! DATALAYER_EVENTS.includes( event ) ) {
        throw new Error( `"${ event } is not a registered dataLayer event name` )
    }

    try {
        window && window.dataLayer && window.dataLayer.push( { event, ...data } )
    } catch ( e ) {
        console.error( e )
    }
}

export const gtmSendPlayAlbum = ( { album } ) =>
    sendDataLayerEvent( 'play_album', { album } )

export const gtmSendPlayTrack = ( { album, track } ) => {
    sendDataLayerEvent( 'play_track', { album, track } )
}
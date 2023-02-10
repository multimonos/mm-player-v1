export const createAudioContext = () => {
    const classname = (window.AudioContext ||
        window.webkitAudioContext ||
        window.mozAudioContext ||
        window.oAudioContext ||
        window.msAudioContext)

    return classname ? new classname() : false
}

export const createRemoteAudioSource = url => async context => {
    const p = new Promise( ( resolve, reject ) => {

        const load = async () => {
            const res = await fetch( url )

            if ( ! res.ok ) reject( res )

            const arrayBuffer = await res.arrayBuffer()
            const audioBuffer = await context.decodeAudioData( arrayBuffer )
            const source = context.createBufferSource()
            source.buffer = audioBuffer

            resolve( source )
        }

        load()
    } )

    return p
}

export const createOscillator = async context => {
    // use promise to keep the api consistent
    const p = new Promise( ( resolve, reject ) => {

        const signal = context.createOscillator()
        signal.frequency.value = 440 + Math.floor(Math.random()* 100)
        signal.type = 'sine'

        resolve( signal )
    } )

    return p
}

export const createMicrophoneSource = async context => {

    const p = new Promise( ( resolve, reject ) => {

        const onStream = stream => {
            const source = context.createMediaStreamSource( stream )
            const filter = context.createBiquadFilter()
            filter.frequency.value = 60.0
            filter.type = 'notch'
            source.connect( filter )
            resolve( source )
        }

        const onStreamError = e => reject( e )

        navigator.webkitGetUserMedia( { audio: true }, onStream, onStreamError )

    } )

    return p
}
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
        signal.frequency.value = 440 + Math.floor( Math.random() * 100 )
        signal.type = 'sine'

        resolve( signal )
    } )

    return p
}


export const createMicrophoneSource = async context => {

    const p = new Promise( async ( resolve, reject ) => {

        // @todo also need to check in we can even get the mediaDevices
        // @see https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API

        try {
            // @see https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Build_a_phone_with_peerjs/Connect_peers/Get_microphone_permission
            const mediaStream = await navigator.mediaDevices.getUserMedia( { audio: true, video:false } )

            // @see https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaStreamSource
            const audioSource = context.createMediaStreamSource(mediaStream)

            resolve(audioSource)

        } catch (e) {
           reject(e)
        }

    } )

    return p
}


export const createAnalyser = ( context, fftBins = 256 ) => {
    const analyser = context.createAnalyser()
    analyser.fftSize = fftBins
    return analyser
}

export const byteFrequencyDomainCollector = audioAnalyser => samples => {
    const s = new Uint8Array( audioAnalyser.frequencyBinCount )
    audioAnalyser.getByteFrequencyData( s )
    return [ ...samples, Array.from( s ) ]
}

export const byteFrequencyDomainSampler = audioAnalyser => {
    const s = new Uint8Array( audioAnalyser.frequencyBinCount )
    audioAnalyser.getByteFrequencyData( s )
    return Array.from( s )
}

export const byteTimeDomainCollector = audioAnalyser => samples => {
    const s = new Uint8Array( audioAnalyser.frequencyBinCount )
    audioAnalyser.getByteTimeDomainData( s )
    return [ ...samples, Array.from( s ) ]
}

export const byteTimeDomainSampler = audioAnalyser => {
    const s = new Uint8Array( audioAnalyser.frequencyBinCount )
    audioAnalyser.getByteTimeDomainData( s )
    return Array.from( s )
}

export const frequencyDomainVisualizer = p5i => s => {
    if ( ! s.length ) return

    const cf = p5i.color( '#2B498F11' )
    const cs = p5i.color( '#2B498F99' )
    p5i.push()

    p5i.fill( cf )
    p5i.stroke( cs )

    const dx = p5i.width / s.length

    for ( let i = 0; i < s.length; i++ ) {
        const h = p5i.map( s[i], 0, 255, 0, p5i.height )
        const y = p5i.height - h
        p5i.rect( i * dx, y, dx, p5i.height )
    }

    p5i.pop()
}

export const timeDomainVisualizer = p5i => samples => {
    if ( samples.length <= 1 ) return

    const c = p5i.color( '#DB6B5866' )

    p5i.push()

    p5i.noFill()
    p5i.strokeWeight( 1 )
    p5i.stroke( c )

    const dx = p5i.width / (samples.length - 1)

    p5i.beginShape()
    for ( let i = 0; i < samples.length; i++ ) {
        const x = i * dx
        const h = p5i.map( samples[i], 0, 255, 0, p5i.height )
        const y = p5i.height - h
        p5i.vertex( x, y )
    }
    p5i.endShape()

    p5i.pop()
}


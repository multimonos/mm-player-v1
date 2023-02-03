// Example usage,
//
// const s = performance.now()
//
// const timeline = [
//     { time: 2000, fn: play },
//     { time: 3000, fn: pause }, // +1
//     { time: 4000, fn: play },
//     { time: 6000, fn: pause }, // +2
//     { time: 7500, fn: play },
//     { time: 8500, fn: pause }, // +2
//     { time: 13000, fn: play },
//     {
//         time: 20000, fn: () => {
//             console.log( '/// killed' )
//             state = 'killed'
//         }
//     },
// ]
// timelineControl( timeline, 0, s )( s )

export const timelineControl = ( marks, ptr, started ) => curr => {

    const dt = Math.ceil( curr - started )

    if ( marks[ptr] && dt >= marks[ptr].time ) {
        marks[ptr].fn()
        ptr++
    }

    requestAnimationFrame( timelineControl( marks, ptr, started ) )
}

export const makeRows = ( layout, data ) => {

    const cellCount = layout
        .reduce( ( sum, row ) => sum + row.cells, 0 )

    // build list of start, end indices
    const ranges = layout.reduce( ( list, row, i ) => {
        const start = list[i - 1]?.end || 0
        const end = (list[i - 1]?.end || 0) + row.cells
        list = [
            ...list,
            { start, end }
        ]
        return list
    }, [] )

    // chunk
    const rows = ranges
        .map( ( range, i ) => ({
            ...layout[i],
            data: data.slice( range.start, range.end )
        }) )


    return rows.filter( r => r.data.length > 0 )
}

export const arrayPad = ( length, arr ) =>
    Array.from( { ...arr, length }, v => v ?? null )
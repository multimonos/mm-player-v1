<script>
import { onMount } from "svelte"


// props
export let sequence

// vars
const createItems = list => {
    const items = [ ...list ]
        .map( x => ({
            ...x,
            visible: false,
            mode: 'tease',
            isLast: false
        }) )

    items[items.length - 1].isLast = true

    return items
}

const items = createItems(sequence )


const swap = ( i, delay ) => {
    setTimeout( () => {
        items[i].mode = 'text'
    }, delay )
}

const timeToWrite = str =>
    str.length * 35

const timeToRead = str =>
    str.length * 35

const sequenceIt = ( idx ) => {

    if ( idx < items.length ) {
        items[idx].visible = true
        const dt = 45 * items[idx].text.length

        const writingTime = timeToWrite( items[idx].text )
        const readingTime = timeToRead( items[idx].text )

        swap( idx, writingTime )

        const responseDelay = Math.random() * 500 + 250

        setTimeout( () => {
            sequenceIt( idx + 1 )
        }, responseDelay + readingTime + writingTime )
    }
}

onMount( () => {
    // console.log( { sequence } )
    sequenceIt( 0, items )
} )


</script>

{#each items as item, i}
    {#if item.visible}
        <div class="chat chat-{item.position}">
            {#if item.mode === 'tease'}
                <div class="chat-bubble {item.classes} animate-pulse">...</div>
            {:else}
                <div class="chat-bubble {item.classes}">{@html item.text}</div>
            {/if}
        </div>
    {/if}
{/each}

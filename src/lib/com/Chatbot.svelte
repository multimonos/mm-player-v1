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

const items = createItems( sequence )


const swap = ( i, delay ) => {
    setTimeout( () => {
        items[i].mode = 'text'
    }, delay )
}

const timeToWrite = str =>
    str.length * 25

const timeToRead = str =>
    str.length * 25

const sequenceIt = ( idx ) => {

    if ( idx < items.length ) {
        items[idx].visible = true

        const writingTime = timeToWrite( items[idx].text )
        const readingTime = timeToRead( items[idx].text )

        swap( idx, writingTime )

        const responseDelay = Math.random() * 250 + 150

        setTimeout( () => {
            sequenceIt( idx + 1 )
        }, responseDelay + readingTime + writingTime )
    }
}

onMount( () => {
    sequenceIt( 0 )
} )

</script>

{#each items as item, i}
    <div class="chat"
         class:chat-end={'end'===item.position}
         class:chat-start={'start'===item.position}>
        {#if item.visible}
            {#if item.mode === 'tease'}
                <div class="chat-bubble {item.classes} animate-pulse">...</div>
            {:else}
                <div class="chat-bubble {item.classes}">{@html item.text}</div>
            {/if}
        {/if}
    </div>
{/each}
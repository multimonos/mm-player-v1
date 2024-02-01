<script>

import { goto } from "$app/navigation"
import { createEventDispatcher } from "svelte";

// Props
export let variants
export let selectBy // param name to use for list item selection

// Reactives
$ : selected = variants.find( v => v.isDefault )

// Constants
const dispatch = createEventDispatcher()


// Functions
$ : isSelectedVariant = variant => {
    return variant.params[selectBy] === selected.params[selectBy]
}

const onClickVariant = params => async e => {

    // Build new query from the current document.location.
    const query = new URLSearchParams( window.document.location.search.toString() )

    // Overwirte params in query.searchParams with incoming values.
    Object.keys( params ).map( k => query.set( k, params[k] ) )

    // Fire the custom "sketch-params" event to notify param consumers..
    const detail = query.toString()
    const event = new CustomEvent( "sketch-params", { detail } )
    window.dispatchEvent( event )

    // Send event for use by parent.
    dispatch( "variant-click", { params } )

    // Selected sketch.
    if ( selectBy in params ) {
        selected = variants.find( v => v.params[selectBy] === params[selectBy] )
    }

    // Navigate.
    await goto( `?${query.toString()}` )
}
</script>
<!--<pre>{JSON.stringify( selected, null, 2 )}</pre>-->
<!--<pre>{JSON.stringify(variants,null,2)}</pre>-->

<div data-tid="sketch-variant-list" class="flex flex-col">
    <ul class="ml-2">
        {#each variants as variant }
            <li class="my-2 mx-0 px-0">
                <button
                    data-tid="sketch-variant-link"
                    data-variantDefault={variant.isDefault}
                    data-variantParams={JSON.stringify(variant.params)}
                    on:click={onClickVariant(variant.params)}
                    class:text-primary={isSelectedVariant(variant)}>
                    <span>{variant.name}</span>
                    <span class="ml-8"><small>{JSON.stringify( variant.params )}</small></span>
                </button>
            </li>
        {/each}
    </ul>
</div>


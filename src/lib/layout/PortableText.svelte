<script>
import { onMount } from "svelte"
import { toHTML } from "@portabletext/to-html"
import { sanityImageUrl } from "$lib/service/sanity-client.js"

// props
export let text

// vars
let hasCodeblock = false

// fns
let renderCodeblock // no need to always load prism.js

const renderImageBlock = ( { value } ) => {
    return `<img src="${ sanityImageUrl( value ).width( 900 ).auto( 'format' ) }"/>`
}

const createRenderCodeblockFn = async blocks => {
    const hasCodeblock = blocks.filter( blk => blk._type === 'codeblock' ).length > 0

    // early exit
    if ( ! hasCodeblock ) {
        return ( { value } ) => '<!-- do not load prism.js -->'
    }

    // load Prism.js
    const module = await import('prismjs')
    await import ("prismjs/themes/prism-dark.min.css")
    const Prism = module.default

    return ( { value } ) => {
        const code = Prism.highlight( value.code, Prism.languages[value.language] )
        return `<pre>${ code }</pre>`
    }
}

// load
onMount( async () => {
    renderCodeblock = await createRenderCodeblockFn( text )
} )

// reactives
$:html = toHTML( text, {
    components: {
        types: {
            image: renderImageBlock,
            codeblock: renderCodeblock
        }
    }
} )

</script>
{#if text}
    <section class="px-4 pb-6 prose prose-headings:font-medium md:max-w-[80ch] xl:pr-2">
        {@html html}
    </section>
{/if}
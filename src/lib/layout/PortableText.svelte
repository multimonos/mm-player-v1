<script>
import { toHTML } from "@portabletext/to-html"
import { sanityImageUrl } from "$lib/service/sanity-client.js"

// props
export let text

// reactives
$:html = toHTML( text, {
    components: {
        types: {
            image: ( { value } ) => {
                console.log(value)
               return `<img src="${ sanityImageUrl(value) }"/>`
            },
        }
    }
} )
</script>
{#if text}
    <section class="px-4 xl:pr-2 pb-6 prose">
        {@html html}
    </section>
{/if}
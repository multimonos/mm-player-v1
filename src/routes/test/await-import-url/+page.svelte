<script>
    // To setup CORS for valet...
    // @see https://rias.be/blog/adding-cors-headers-to-laravel-valet
    import { onMount } from "svelte"
    import { PUBLIC_MEDIA_API_URL } from "$env/static/public"


    const remote = async ( baseuri ) => {
        // dynamic remote import with single export
        const { one } = await import(/* @vite-ignore */`${ baseuri }/test/one.bundle.js`)
        one()

        // dynamic remote import with multiple exports
        const { oneOfTwo, twoOfTwo } = await import(/* @vite-ignore */`${ baseuri }/test/one-and-two.bundle.js`)
        oneOfTwo()
        twoOfTwo()

        // dynamic remote import a p5js sketch defined as an instance named "sketch"
        const p5 = await import('p5')
        const { sketch } = await import(/* @vite-ignore */`${ baseuri }/test/p5js-sketch.bundle.js`)
        console.log( 'PASS', { sketch } )
        new p5.default( sketch, 'stuff' )

        // dynamic remote import with querystring - called script parses the querystring
        const { importWithQuerystring } = await import(/* @vite-ignore */`${ baseuri }/test/querystring.bundle.js?foo=bar&bam=yarr`)
        importWithQuerystring()

        // dynamic remote import a file, unbundled that depends on custom code only
        const { importImportsTestUtil } = await import(/* @vite-ignore */`${ baseuri }/test/import-util.bundle.js`)
        importImportsTestUtil()
    }

    onMount( async () => {

        remote( PUBLIC_MEDIA_API_URL )

    } )
</script>


<div id="stuff"></div>

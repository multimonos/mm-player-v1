<script>
    // To setup CORS for valet...
    // @see https://rias.be/blog/adding-cors-headers-to-laravel-valet
    import { onMount } from "svelte"


    const remote = async (baseuri) => {
        // dynamic remote import with single export
        const { one } = await import(`${baseuri}/test/one.bundle.js`)
        one()

        // dynamic remote import with multiple exports
        const { oneOfTwo, twoOfTwo } = await import(`${baseuri}/test/one-and-two.bundle.js`)
        oneOfTwo()
        twoOfTwo()

        // dynamic remote import a p5js sketch defined as an instance named "sketch"
        const p5 = await import('p5')
        const {  sketch } = await import(`${baseuri}/test/p5js-sketch.bundle.js`)
        console.log('PASS', { sketch } )
        new p5.default( sketch, 'stuff' )

        // dynamic remote import with querystring - called script parses the querystring
        const { importWithQuerystring } = await import(`${baseuri}/test/querystring.bundle.js?foo=bar&bam=yarr`)
        importWithQuerystring()

        // dynamic remote import a file, unbundled that depends on custom code only
        const { importImportsTestUtil } = await import(`${baseuri}/test/import-util.bundle.js`)
        importImportsTestUtil()
    }

    onMount( async () => {

        remote('https://mm-media.netlify.app')
        remote('http://mm-media.test')

    } )
</script>


<div id="stuff"></div>

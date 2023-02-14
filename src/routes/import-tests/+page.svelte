<script>
    // To setup CORS for valet...
    // @see https://rias.be/blog/adding-cors-headers-to-laravel-valet
    import { onMount } from "svelte"


    const local = async () => {
        // const p5 = await import('p5')
        const { one } = await import(`http://js.test/one.js`)
        one()

        const { meta, sketch } = await import(`http://js.test/blue.js`)
        console.log( { meta, sketch } )

        const { queryparams } = await import(`http://js.test/queryparams.js?foo=bar&bam=yarr`)
        queryparams()
    }

    const remote = async () => {
        const p5 = await import('p5')
        const { one } = await import(`https://multimonos-media-tests.netlify.app/one.js`)
        one()

        const foo = 'multimonos'
        const { meta, sketch } = await import(`https://${foo}-media-tests.netlify.app/blue.js`)
        new p5.default( sketch, 'stuff' )
        console.log( { meta, sketch } )

        const { queryparams } = await import(`https://multimonos-media-tests.netlify.app/queryparams.js?foo=bar&bam=yarr`)
        queryparams()
    }

    onMount( async () => {

        local()
        remote()
        // https://multimonos-media-tests.netlify.app/

    } )
</script>


<div id="stuff"></div>

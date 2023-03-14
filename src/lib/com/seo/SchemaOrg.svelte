<script>
// @see https://navillus.dev/blog/json-ld-in-sveltekit

const serializeSchema = json =>
    `<script type="application/ld+json">${ JSON.stringify( json, null, 2 ) }</` + `script>`

export let schema
</script>

<svelte:head>
    {@html serializeSchema( schema )}
</svelte:head>

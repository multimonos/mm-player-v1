<script>
import { onMount } from "svelte";
import TestNotFound from "../TestNotFound.svelte";

// Props
export let data

// Vars

// Reactives
$ : wasFound = null
$ : modulePromise = new Promise( resolve => {} )
$ : links = []

onMount( async () => {

    // console.clear()

    // candidates
    const haystack = import.meta.glob( `/src/routes/e2e/**/Test*.svelte` )
    const modulePaths = Object.keys( haystack )
    const lookup = modulePaths.reduce( ( dict, path ) => {
        const com = path
            .replace( /.+\/Test/, "Test" )
            .replace( ".svelte", "" )
        dict[com] = haystack[path]
        return dict
    }, {} )

    console.log( { lookup, com: data.tid } )

    // make links of each module path
    links = modulePaths.reduce( ( list, path ) => {
        const link = {
            text: path.replace( /^.+\/Test/g, "" ).replace(".svelte","").replace(/([A-Z])/g,(m,s)=>` ${s}`),
            slug: path.replace(/^.+\/Test/,"").replace(".svelte","").replace(/([A-Z])/g,(m,s)=>`-${s}`).replace(/^-/,"").toLowerCase(),
            path,
        }

        return [ link, ...list ]
    }, [] )

    // set component
    if ( data.tid in lookup ) {
        console.log( `test : ${data.tid}` )
        const importer = lookup[data.tid]
        modulePromise = importer()
        wasFound = true
    } else {
        wasFound = false
    }

} )
</script>


{#if wasFound }

    <h1 class="my-4 text-md"><code>{data.tid}</code></h1>

    {#await modulePromise}
        Locating {data.tid} ...
    {:then module}
        <svelte:component this={module.default}/>
    {/await}

{/if}

{#if wasFound === false}

    <TestNotFound tid={data.tid}/>

    <ul class="m-4 list-disc flex flex-col gap-2">
        {#each links as link}
            <li class="flex flex-col">
                <a href="/e2e/{link.slug}" target="_top" class="link-hover">{link.text}</a>
                <small class="text-neutral-content/50">{link.path}</small>
            </li>
        {/each}
    </ul>

{/if}
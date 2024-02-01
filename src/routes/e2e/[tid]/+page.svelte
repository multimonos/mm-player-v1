<script>
import { onMount } from "svelte";
import {PUBLIC_API_BASEURI} from "$env/static/public";
import "iconify-icon"

// Props
export let data

// Reactives
$ : tid = data.tid
$ : selected = data.tests.find( t => t.slug === data.tid )

const loadTest = async test => {
    const modules = await import.meta.glob( `/src/routes/e2e/**/Test*.svelte` )
    const key = Object.keys( modules ).find( path => path.endsWith( test.path ) )
    const module = await modules[key]()
    const component = module.default
    return component
}
</script>

<pre>{PUBLIC_API_BASEURI}</pre>
{#if selected && tid !== "home"}

    <h1 class="my-4 text-md"><code>{selected.name}</code></h1>
    {#await loadTest( selected )}
        <p>... loading</p>
    {:then com }
        <svelte:component this={com}/>
    {/await}
{:else}

    <div class="alert alert-info">
        <span>No test selected.</span>
    </div>
    <ul class="m-4 list-disc flex flex-col gap-2">
        {#each data.tests as test}
            <li class="flex flex-col">
                <div>
                    <a href={test.url} class="link-hover">{test.name}</a>

                    <a href={test.url} target="_top" class="link-hover ml-2"><iconify-icon icon="tabler:external-link"/></a>
                </div>
                <small class="text-neutral-content/50">{test.path}</small>
            </li>
        {/each}
    </ul>
{/if}
<!--<pre>{JSON.stringify( { data }, null, 2 )}</pre>-->

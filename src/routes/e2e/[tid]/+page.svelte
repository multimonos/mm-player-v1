<script>
import "iconify-icon"
import LinkTest from "../LinkTest.svelte";
// Props
export let data

// Reactives
$ : tid = data.tid
$ : test = data.tests.find( t => t.slug === data.tid )

const loadTest = async test => {
    const modules = await import.meta.glob( `/src/routes/e2e/**/Test*.svelte` )
    const key = Object.keys( modules ).find( path => path.endsWith( test.basename ) )
    const module = await modules[key]()
    const component = module.default
    return component
}
</script>

{#if test }

    <div class="my-4">
        <LinkTest {test}/>
    </div>


    {#await loadTest( test )}
        <p>... loading</p>
    {:then com }
        <svelte:component this={com}/>
    {/await}
{/if}

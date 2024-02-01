<script>

import LinkTest from "./LinkTest.svelte";

export let data
</script>


{#if data.tests.length }
    <ul class="my-4 list-disc flex flex-col gap-2">
        {#each data.tests as test}
            <li>
                <LinkTest {test}/>
            </li>
        {/each}
    </ul>
{:else}
    <div class="alert alert-error">
        <span>No test components found.</span>
    </div>
{/if}


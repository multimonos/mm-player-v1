<script>
import Contained from "$lib/layout/Contained.svelte"

//props
export let data
const sketches = data.sketches || []
</script>
<Contained>
    <section class="mt-4 prose">
        <h2>How to use</h2>
        <ul>
            <li>Access sketches via <code>/sketch/&lt;filename&gt;</code></li>
            <li>If sketch path has is a subdirectory then replace <code>/ --> %2F</code></li>
        </ul>

        <p>For example,</p>
        <ul>
            <li><code>/sketch/sketches/foobar.js</code> then url is <code>/sketch/foobar/</code></li>
            <li><code>/sketch/sketches/foobar/bam.js</code> then url is <code>/sketch/foobar%2Fbam</code></li>
        </ul>

        <h2>Sketches</h2>
        {#if sketches.length}
            <ul>
                {#each sketches as sketch}
                    <li><a class="no-underline hover:underline" target="_blank" href="{sketch.url}"><code>{sketch.path}</code></a></li>

                {/each}
            </ul>
        {:else}
            <p>None</p>
        {/if}
    </section>
</Contained>

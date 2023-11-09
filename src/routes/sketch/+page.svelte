<script>
import Contained from "$lib/layout/Contained.svelte"

//props
export let data
const sketches = data.sketches || []
</script>
<Contained>
    <div class="flex mt-4">
        <section class="flex-1 prose">
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

        <section class="flex-2 prose prose-a:text-normal">
            <h2>How to use</h2>
            <ul>
                <li>Access sketches via <code>/sketch/&lt;filenpath-no-extension&gt;/</code></li>
                <li>If filepath is a subdirectory then replace <code>/</code> with <code>%2F</code> in urls</li>
            </ul>

            <p>For example,</p>
            <ul>
                <li><code>/sketch/sketches/foobar.js</code> then url is <code>/sketch/foobar/</code></li>
                <li><code>/sketch/sketches/foobar/bam.js</code> then url is <code>/sketch/foobar%2Fbam/</code></li>
            </ul>

            <h2>Notes</h2>
            <ul>
                <li>run <code>npm run dev</code> in <code>mm-com</code> codebase, aka sveltekit, to refresh sketches &mdash; not out of <code>mm-media</code></li>
                <li>work out of the <code>mm-media</code> codebase not the <code>mm-com</code> codebase</li>
                <li><code>mm-com</code> repository is at <a href="https://github.com/multimonos/mm-sandbox" target="_blank">git@github.com:multimonos/mm-sandbox.git</a></li>
                <li><code>mm-media</code> repository is at <a href="https://github.com/multimonos/mm-media" target="_blank">git@github.com:multimonos/mm-media.git</a></li>
                <li><code>/src/routes/sketch/sketches/</code> is symlinked to <code>mm-media/src/sketches</code></li>
                <li><code>/src/routes/sketch/sketches/lib/</code> is symlinked to <code>mm-media/src/lib</code></li>
            </ul>
        </section>

    </div>
</Contained>

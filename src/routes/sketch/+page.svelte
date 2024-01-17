<script>
import Contained from "$lib/layout/Contained.svelte"

//props
export let data

// vars
const getSketches = async ( baseuri ) => {
    const res = await fetch( `${ baseuri }/sketches?filter[status]=draft` )
    const json = await res.json()
    const {data}=json
    console.log({data})
    return data
    return json.data
}
</script>
<Contained>
    <div class="flex flex-col mx-4 mt-8">
        <section class="flex-1 prose">
            <h2>Sketches</h2>
            {#await getSketches( data.BASEURI_API )}
                Loading...
            {:then sketches}
                <ul>
                    {#each sketches as sketch}
                        <li><a class="no-underline hover:underline" target="_blank" rel="noreferrer" href="/sketch/{encodeURIComponent(sketch.id)}"><span class="font-normal font-mono text-sm">{sketch.id}</span></a></li>
                    {/each}
                </ul>
            {/await}
        </section>

        <section class="flex-2 prose prose-a:text-normal">
            <h2>How to use</h2>
            <ul>
                <li>sketches live in path<code>@mm-media/src/wip</code></li>
                <li>work out of the <code>@mm-media</code> codebase not the <code>@mm-com</code> codebase</li>
                <li><code>GET</code> sketches via url <code>@mm-com/sketch/:id</code></li>
                <li>load <code>@mm-media/dist/foobar.bundle.js</code> with url <code>@mm-com/sketch/foobar</code></li>
                <li>replace <code>/</code> in <code>sketch.id</code> with <code>%2F</code> in urls</li>
            </ul>

            <h2>Notes</h2>
            <ul>
                <li>run <code>npm run sketch</code> in <code>@mm-media</code> codebase</li>
                <li>refresh happens by <code>@mm-media.rollup</code> writing a uniqid to the file at <code>src/routes/sketch/[id]/force-vite-reload.js</code></li>
                <li><code>mm-com</code> repository is at <a href="https://github.com/multimonos/mm-player" rel="noreferrer" target="_blank">git@github.com:multimonos/mm-player.git</a></li>
                <li><code>mm-media</code> repository is at <a href="https://github.com/multimonos/mm-media" rel="noreferrer" target="_blank">git@github.com:multimonos/mm-media.git</a></li>
            </ul>
        </section>

    </div>
</Contained>

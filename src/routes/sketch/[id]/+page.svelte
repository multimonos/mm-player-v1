<script>
import { page } from "$app/stores.js"
import { onDestroy, onMount } from "svelte"
import { service } from "$lib/state-machine/app-machine.js"
import { RenderableTag } from "$lib/state-machine/tags.js"
import { cancel, play, queue, queueClear } from "$lib/actions"

// com
import Media from "$lib/com/media/Media.svelte"

// props
export let data

onMount( () => {
    // enter sketch mode
    service.send( 'sketching' )

    // play the faked track
    cancel()
    queueClear()
    queue( data.track )
    play()

} )

onDestroy( () => {
    cancel()
} )

// reactives
$:showTracklist = $page.url.searchParams.has( 'tracklist' )
</script>


<!-- AUDIO PICKER -->
{#if showTracklist}
    <div class="absolute left-0 top-16 z-[40] h-auto flex flex-col justify-center px-2">
        <div>
            <div class="collapse">
                <input type="checkbox"/>
                <div class="collapse-title text-xl font-medium">
                    <span class="text-sm">tracks</span>
                </div>
                <div class="collapse-content">
                    <div class="flex flex-col bg-content">
                        {#each data.audioResources as resource}
                            <a rel="external"
                               href={`/sketch/${data.slug}/?audioUrl=${resource.url}`}
                               class:text-accent={resource.selected}
                               class="text-sm hover:text-primary">{resource.title}</a>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}


<!-- MESSAGES -->
<div class="fixed left-0 top-16 z-[40] h-16 flex flex-col justify-center px-2">
    <!--    <a href="https://mm-media.netlify.app/.netlify/functions/audio" target="_blank">audio</a>-->
</div>


<!-- PLAYER -->
<!-- this should be just renderiung, preparation should be up to the sketch and/or the sketch should signal when it's ready -->
{#if ($service.hasTag( RenderableTag )) && $service.context.media?.component}
    <div class="h-full flex flex-col justify-center items-center overflow-x-hidden overflow-y-clip">
        <Media component={$service.context.media.component} media={$service.context.media}/>
    </div>
{/if}
<script>
import { onDestroy, onMount } from "svelte"
import { service } from "$lib/state-machine/app-machine.js"
import { RenderableTag } from "$lib/state-machine/tags.js"
import { cancel, play, queue, queueClear } from "$lib/actions"
import { fakeTrack } from "./fake-track.js"

// com
import Media from "$lib/com/media/Media.svelte"


// props
export let data
console.log( { data } )


// Audio Source
////////////////////
const defaultAudioUrl = 'https://res.cloudinary.com/multimonos/video/upload/du_5555518331073/audio/animals/bbc_giant-toad_nhu0501904.mp3'
const sketchpath = '/src/routes/sketch/coldwave-moonrise.js'
const track = fakeTrack( {
    name: data.sketchSlug,
    duration: data.duration || false,
    sketchpath: data.sketchPath,
    params: {
        audioUrl: data.audioUrl || defaultAudioUrl
    }
} )


// OnMount
////////////////////
onMount( async () => {
    console.log( '@sketch : mounted' )

    // enter sketch mode
    service.send( 'sketch' )

    // log critical
    console.log( '@sketch : source :', data.sketchPath )
    console.log( '@sketch : audio  :', data.audioUrl )

    // play the current track
    cancel()
    queueClear()
    queue( track )
    play()
} )

onDestroy( async () => {
    cancel()
    console.log( '@sketch : destroyed' )
} )
</script>


<!-- AUDIO PICKER -->
<div class="absolute left-0 top-16 z-[40] h-auto flex flex-col justify-center px-2">
    <div>
        <div class="collapse">
            <input type="checkbox"/>
            <div class="collapse-title text-xl font-medium">
                Audio Sources [{data.audioResources.length}]
            </div>
            <div class="collapse-content">
                <div class="flex flex-col bg-content">
                    {#each data.audioResources as resource}
                        <a rel="external" href={`/sketch/${data.sketchSlug}/?audioUrl=${resource.url}`} class="hover:text-primary">{resource.id}</a>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>


<!-- MESSAGES -->
<div class="fixed left-0 top-16 z-[40] h-16 flex flex-col justify-center px-2">
    <!--{#if ! audioUrls.length}<span class="text-error">awaiting audio urls</span>{/if}-->
    <!--    <a href="https://mm-media.netlify.app/.netlify/functions/audio" target="_blank">audio</a>-->
</div>


<!-- PLAYER -->
{#if ($service.hasTag( RenderableTag )) && $service.context.media?.component}
    <div class="h-full flex flex-col justify-center items-center overflow-x-hidden overflow-y-clip">
        <Media component={$service.context.media.component} props={$service.context.media.componentProps}/>
    </div>
{/if}
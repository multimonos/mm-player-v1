<script>
import { onDestroy, onMount } from "svelte"
import { fade } from "svelte/transition"
import { RenderableTag } from "$lib/state-machine/tags.js"
import { IdleState } from "$lib/state-machine/states.js"
import { CancelEvent, PersistEvent, PlayEvent } from "$lib/state-machine/events.js"
import { service } from "$lib/state-machine/app-machine.js"
import { play } from "$lib/actions.js"
import Icon from "$lib/com/icon/Icon.svelte"
import Media from "$lib/com/media/Media.svelte"
import MetaTags from "$lib/com/seo/MetaTags.svelte"

// props
export let data

// fns
onMount( () => {
    console.log( '@player mounted' )
} )

onDestroy( () => {
    service.send( PersistEvent )
    service.send( CancelEvent )
    console.log( '@player destroyed' )
} )
</script>

<MetaTags tags={data.meta}/>

{#if ($service.hasTag( RenderableTag )) && $service.context.media?.component}
    <div class="h-full flex flex-col justify-center items-center overflow-x-hidden overflow-y-clip" in:fade>
        <Media component={$service.context.media.component} props={$service.context.media.componentProps}/>
    </div>
{:else if $service.value.player === IdleState}
    <div class="h-full flex flex-col items-center justify-center">
        {#if $service.context.q.length === 0}
            <div class="flex flex-col items-center">
                <Icon icon="mdi:robot-confused-outline" size="lg"/>
                <p class="mt-2">Looks like your queue is empty</p>
            </div>
        {:else if $service.can( PlayEvent )}
            <div class="flex items-center">
                <button data-tid="play-queue" type="button" class="btn btn-circle btn-lg hover:text-accent" on:click={() => play()}>
                    <Icon icon="mdi:play" size="lg"/>
                </button>
                <p class="mt-2">Play</p>
            </div>
        {/if}
    </div>
{/if}
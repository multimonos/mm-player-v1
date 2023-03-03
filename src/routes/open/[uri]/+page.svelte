<script>
import { service } from "$lib/state-machine/app-machine.js"
import { QueueThenPlayEvent } from "$lib/state-machine/events.js"
import TracksDuration from "$lib/com/track/TracksDuration.svelte"
import AlbumType from "$lib/com/album/AlbumType.svelte"
import Icon from "$lib/com/icon/Icon.svelte"
import Chatbot from "$lib/com/Chatbot.svelte"


// props
export let data

// vars
let visible = true

const play = tracks => async () => {
    service.send( { type: QueueThenPlayEvent, tracks } )
}

const sequence = [
    { text: 'what kind of nonsense is this?', position: 'start', classes: 'chat-bubble-primary' },
    { text: `bc i luv you sooooooo much ... I wanted you to check out this <strong>${ data.item.type }</strong> ;)`, position: 'end', classes: 'chat-bubble-secondary' },
    { text: 'awwwwwwww ... <span class="text-2xl">😘</span>', position: 'start', classes: 'chat-bubble-primary' },
    { text: 'hope u like it!', position: 'end', classes: 'chat-bubble-secondary' },
    { text: 'oxo', position: 'end', classes: 'chat-bubble-secondary' },
]

</script>

{#if 'album' === data.item.type}

    <div class="hero bg-base-200">
        <div class="hero-content flex-col lg:flex-row">
            <div class="relative">
                <img src="{data.item.images[0].url}" class="rounded-lg shadow-2xl"/>

                <div class="absolute top-0 w-full h-full flex justify-center items-center">
                    <button data-tid="play-shared" class="btn btn-lg btn-circle btn-ghost text-primary/80 bg-black/70 hover:text-primary animate-pulse" on:click={play(data.item.tracks)}>
                        <Icon icon="mdi:play" size="lg"/>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="px-4 mb-16">
        <div class="text-center mb-4">
            <h1 class="text-md font-bold">{data.item.name}</h1>

            <p class="text-xs">
                <AlbumType type={data.item.type}/>
                &bull; {data.item.tracks.length} tracks
                &bull;
                <TracksDuration tracks={data.item.tracks}/>
            </p>
        </div>

        <Chatbot { sequence}/>
    </div>
{:else if 'track' === data.item.type}

    <div class="hero bg-base-200">
        <div class="hero-content flex-col lg:flex-row">
            <div class="relative">
                <img src="{data.item.album.images[0].url}" class="rounded-lg shadow-2xl"/>

                <div class="absolute top-0 w-full h-full flex justify-center items-center">
                    <button data-tid="play-shared" class="btn btn-lg btn-circle btn-ghost text-primary/80 bg-black/70 hover:text-primary animate-pulse" on:click={play([data.item])}>
                        <Icon icon="mdi:play" size="lg"/>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="px-4 mb-16">
        <div class="text-center mb-4">
            <h1 class="text-md font-bold">{data.item.name}</h1>

            <p class="text-xs">
                Track
                &bull;
                <TracksDuration tracks={[data.item]}/>
            </p>
        </div>

        <Chatbot { sequence}/>
    </div>
{/if}


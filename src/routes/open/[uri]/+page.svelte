<script>
import { queueOneThenPlay } from "$lib/actions.js"
import TracksDuration from "$lib/com/track/TracksDuration.svelte"
import Icon from "$lib/com/icon/Icon.svelte"
import Chatbot from "$lib/com/Chatbot.svelte"
import AlbumType from "$lib/com/album/AlbumType.svelte"


// props
export let data

// vars
let visible = true

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
                        <button data-tid="play-shared" class="btn btn-lg btn-circle btn-ghost text-primary/80 bg-black/70 hover:text-primary animate-pulse" on:click={queueManyThenPlay(data.item.tracks)}>
                            <Icon icon="mdi:play" size="lg"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="px-4 mb-8">
            <div class="text-center mb-4">
                <h1 class="text-md font-bold">{data.item.name}</h1>

                <p class="text-xs">
                    <AlbumType type={data.item.type}/>
                    &bull; {data.item.tracks.length} tracks
                    &bull; <TracksDuration tracks={data.item.tracks}/>
                </p>
            </div>
        </div>

{:else if 'track' === data.item.type}
    <div class="hero bg-base-200">
        <div class="hero-content flex-col lg:flex-row">
            <div class="relative">
                <img src="{data.item.album.images[0].url}" class="rounded-lg shadow-2xl"/>

                <div class="absolute top-0 w-full h-full flex justify-center items-center">
                    <button data-tid="play-shared" class="btn btn-lg btn-circle btn-ghost text-primary/80 bg-black/70 hover:text-primary animate-pulse" on:click={queueOneThenPlay(data.item)}>
                        <Icon icon="mdi:play" size="lg"/>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="px-4 mb-8">
        <div class="text-center mb-4">
            <h1 class="text-md font-bold">{data.item.name}</h1>

            <p class="text-xs">
                Track
                &bull;
                <TracksDuration tracks={[data.item]}/>
            </p>
        </div>

    </div>
{/if}


<div class="px-2 pb-24">
    <Chatbot { sequence}/>
</div>

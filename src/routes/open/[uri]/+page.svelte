<script>
import { queueManyThenPlay, queueOneThenPlay } from "$lib/actions.js"
import Chatbot from "$lib/com/Chatbot.svelte"
import Button from "$lib/com/button/Button.svelte"
import AlbumCard from "$lib/com/album/AlbumCard.svelte"
import TrackCard from "$lib/com/track/TrackCard.svelte"
import MetaTags from "$lib/com/seo/MetaTags.svelte"
import Contained from "$lib/layout/Contained.svelte"


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

<Contained>

    <div class="flex flex-col md:flex-row">

    <section class="h-100vw md:h-[50vw] md:flex-[3]">

        {#if 'album' === data.item.type}
            <AlbumCard album={data.item} onClick={queueManyThenPlay(data.item.tracks)}>
                <div class="absolute w-full h-full inset-0 flex justify-center items-center cursor-pointer">
                    <Button tid="play-shared"
                            size="lg"
                            shape="circle"
                            icon="mdi:play"
                            classes="text-primary animate-pulse"
                            on:click={queueManyThenPlay(data.item.tracks)}/>
                </div>
                <div slot="footer"></div>
            </AlbumCard>
        {/if}

        {#if 'track' === data.item.type}
            <TrackCard track={data.item} onClick={queueOneThenPlay(data.item)}>
                <div class="absolute w-full h-full inset-0 flex justify-center items-center cursor-pointer">
                    <Button tid="play-shared"
                            size="lg"
                            shape="circle"
                            icon="mdi:play"
                            classes="text-primary animate-pulse"
                            on:click={queueManyThenPlay(data.item.tracks)}/>
                </div>
            </TrackCard>
        {/if}

    </section>

    <section id="share-chatbot" class="px-2 pb-24 mt-4 md:flex-[2]">
        <Chatbot { sequence}/>
    </section>
    </div>
</Contained>

<!--<MetaTags tags={createMetaTags(`share.${data.item.type}`, data.item)}/>-->
<MetaTags tags={data.meta}/>

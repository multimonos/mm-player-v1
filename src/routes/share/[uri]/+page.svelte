<script>
import { queueReplaceThenPlay } from "$lib/actions.js"
import { gtmSendPlayAlbum, gtmSendPlayTrack } from "$lib/util/gtm.js"
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
    { text: `bc i luv you sooooooo much ... I wanted you to check out this <strong>${ data.item._type }</strong> ;)`, position: 'end', classes: 'chat-bubble-secondary' },
    { text: 'awwwwwwww ... <span class="text-2xl">😘</span>', position: 'start', classes: 'chat-bubble-primary' },
    { text: 'hope u like it!', position: 'end', classes: 'chat-bubble-secondary' },
    { text: 'oxo', position: 'end', classes: 'chat-bubble-secondary' },
]

const playAlbum = album => e => {
    gtmSendPlayAlbum( { album: album.name } )
    queueReplaceThenPlay( album.tracks )
}

const playTrack = track => e => {
    gtmSendPlayTrack( { track: track.name, album: track.album.name } )
    queueReplaceThenPlay( [ track ] )
}
</script>

<Contained>

    <div class="flex flex-col md:flex-row">

        <section class="h-100vw md:h-[50vw] md:flex-[3]">

            {#if 'album' === data.item._type}
                <AlbumCard album={data.item} onClick={playAlbum(data.item)}>
                    <div class="absolute w-full h-full inset-0 flex justify-center items-center cursor-pointer">
                        <Button tid="play-shared"
                                size="lg"
                                shape="circle"
                                icon="mdi:play"
                                classes="text-primary animate-pulse"
                                on:click={playAlbum(data.item)}/>
                    </div>
                    <div slot="footer"></div>
                </AlbumCard>
            {/if}

            {#if 'track' === data.item._type}
                <TrackCard track={data.item} onClick={playTrack(data.item)}>
                    <div class="absolute w-full h-full inset-0 flex justify-center items-center cursor-pointer">
                        <Button tid="play-shared"
                                size="lg"
                                shape="circle"
                                icon="mdi:play"
                                classes="text-primary animate-pulse"
                                on:click={playTrack(data.item)}/>
                    </div>
                </TrackCard>
            {/if}

        </section>

        <section id="share-chatbot" class="px-2 pb-24 mt-4 md:flex-[2]">
            <Chatbot {sequence}/>
        </section>
    </div>
</Contained>

<MetaTags tags={data.meta}/>

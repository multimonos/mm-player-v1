<script>
import { queueManyThenPlay, queueOneThenPlay } from "$lib/actions.js"
import { titlecase,  pluralIf, tracksDuration} from "$lib/util/string.js"
import Chatbot from "$lib/com/Chatbot.svelte"
import Button from "$lib/com/button/Button.svelte"
import AlbumCard from "$lib/com/album/AlbumCard.svelte"
import TrackCard from "$lib/com/track/TrackCard.svelte"
import OpenGraph from "$lib/com/seo/OpenGraph.svelte"
import MetaTags from "$lib/com/seo/MetaTags.svelte"


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

<section class="h-100vw">

    {#if 'album' === data.item.type}
        <AlbumCard album={data.item} onClick={queueManyThenPlay(data.item.tracks)}>
            <div class="flex justify-center items-center">
                <Button tid="play-shared"
                        size="lg"
                        shape="circle"
                        icon="mdi:play"
                        classes="text-primary animate-pulse"
                        on:click={queueManyThenPlay(data.item.tracks)}/>
            </div>
        </AlbumCard>

        <OpenGraph tags={[
            { name: 'og:url', value: data.item.links.share},
            { name: 'og:type', value: ''},
            { name: 'og:title', value: `${data.item.name} - ${titlecase(data.item.album_type)}`},
            { name: 'og:description', value: `${data.item.name} by multimonos is a ${data.item.tracks.length} track multimedia ${data.item.album_type}. Running time of ${tracksDuration(data.item.tracks)}.` },
            { name: 'og:determiner', value: 'the'},
            { name: 'og:locale', value: 'en_CA'},
            { name: 'og:image', value: data.item.images?.[0].url},
            { name: 'og:image:alt', value: `Poster for the ${data.item.name} ${titlecase(data.item.album_type)}` },
            { name: 'og:type', value: `multimonos:${data.item.album_type}`},
            //{ name: 'og:image:width', value: data.item.images?.[0].url}, // @todo
            //{ name: 'og:image:height', value: data.item.images?.[0].url}, // @todo
        ]}/>
        <MetaTags tags={[
            {name: 'title', value: `${data.item.name} ${titlecase(data.item.album_type)} by multimonos | Play all tracks`}
        ]}/>


    {/if}

    {#if 'track' === data.item.type}
        <TrackCard track={data.item} onClick={queueOneThenPlay(data.item)}>
            <div class="flex justify-center mt-16">
                <Button tid="play-shared"
                        size="lg"
                        shape="circle"
                        icon="mdi:play"
                        classes="text-primary animate-pulse"
                        on:click={queueManyThenPlay(data.item.tracks)}/>
            </div>
        </TrackCard>

        <OpenGraph tags={[
            { name: 'og:url', value: data.item.links.share},
            { name: 'og:type', value: ''},
            { name: 'og:title', value: `${data.item.name} ${titlecase(data.item.type)} by multimonos | ${data.item.album.name} ${data.item.album.album_type}`},
            { name: 'og:description', value: `${data.item.name} ${titlecase(data.item.type)} by multimonos is a multimedia track off the ${data.item.album.album_type} ${data.item.album.name}. Running time of ${tracksDuration(data.item)}.` },
            { name: 'og:determiner', value: 'the'},
            { name: 'og:locale', value: 'en_CA'},
            { name: 'og:image', value: data.item.album.images?.[0].url},
            { name: 'og:image:alt', value: `Poster for the ${data.item.name} off the ${data.item.album.album_type} ${data.item.album.name}` },
            { name: 'og:type', value: `multimonos:${data.item.type}`},
        ]}/>

        <MetaTags tags={[
            {name: 'title', value: `${data.item.name} ${titlecase(data.item.type)} by multimonos | ${data.item.album.name} ${data.item.album.album_type} | Play track`}
        ]}/>


    {/if}

</section>

<section class="px-2 pb-24 mt-4">
    <Chatbot { sequence}/>
</section>


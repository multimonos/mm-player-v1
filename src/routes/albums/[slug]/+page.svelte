<script>
import { queueManyThenPlay, queueOneThenPlay } from "$lib/actions.js"

// com
import ContentBlock from "$lib/layout/ContentBlock.svelte"
import IfDebug from "$lib/com/util/IfDebug.svelte"
import TracksDuration from "$lib/com/track/TracksDuration.svelte"
import MoreButton from "$lib/com/button/MoreButton.svelte"
import AlbumCard from "$lib/com/album/AlbumCard.svelte"
import AlbumType from "$lib/com/album/AlbumType.svelte"
import ShareButton from "$lib/com/share/ShareButton.svelte"
import PlayButton from "$lib/com/transport/button/PlayButton.svelte"
// props
export let data

// reactives
$: album = data.album
</script>


<section id="album-hero" class="h-[100vw]">
    <AlbumCard {album}>
        <div slot="header">
            <p class="text-xs">
                <AlbumType type={album.type}/>
                &bull; {album.tracks.length} tracks
                &bull; <TracksDuration tracks={album.tracks}/>
            </p>
        </div>
        <div slot="footer"/>
    </AlbumCard>

</section>

<section id="album-actions" class="flex items-center justify-between my-4">
    <div class="flex items-center">
        <PlayButton enabled={true} on:click={queueManyThenPlay(album.tracks)}/>
        <button type="button" class="" on:click={queueManyThenPlay(album.tracks)}>Play all</button>
    </div>
    <ShareButton/>
</section>

<section class="p-2">
    {#if album.tracks}

        <div id="tracklist" class="flex flex-col space-y-2">
            {#each album.tracks as track, n }
                <div class="flex items-center space-x-2">
                    <button id="track-details" class="ghost flex-1 flex items-center cursor-pointer hover:text-primary mr-6" on:click={queueOneThenPlay(track)}>
                        <span class="flex-none flex items-center justify-center h-8 w-8 mr-4 text-xs">{n + 1}</span>
                        <span class="flex-1 text-sm text-left">{track.name}</span>
                    </button>

                    <div id="track-actions" class="flex-none">
                        <MoreButton/>
                    </div>
                </div>
            {/each}
        </div>

        <div class="w-full h-[1px] my-6 bg-gradient-to-r from-primary  to-white"></div>
    {/if}
</section>

<ContentBlock>
    <div class="prose">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci autem beatae debitis ducimus eius eos hic illum ipsa laboriosam mollitia necessitatibus nesciunt odio possimus quo quos saepe sed, tempore ut.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci autem beatae debitis ducimus eius eos hic illum ipsa laboriosam mollitia necessitatibus nesciunt odio possimus quo quos saepe sed, tempore ut.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci autem beatae debitis ducimus eius eos hic illum ipsa laboriosam mollitia necessitatibus nesciunt odio possimus quo quos saepe sed, tempore ut.</p>
    </div>
    <br>
</ContentBlock>
<IfDebug value={data.album}/>
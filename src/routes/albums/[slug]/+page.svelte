<script>
import { queueReplaceThenPlay, queueThenPlay } from "$lib/actions.js"
import { gtmSendPlayAlbum, gtmSendPlayTrack } from "$lib/util/gtm.js"
import { createAlbumShare } from "$lib/model/share-factory.js"

// com
import IfDebug from "$lib/com/util/IfDebug.svelte"
import ShareButton from "$lib/com/share/ShareButton.svelte"
import MetaTags from "$lib/com/seo/MetaTags.svelte"
import Contained from "$lib/layout/Contained.svelte"
import ContentEnd from "$lib/layout/ContentEnd.svelte"
import Divider from "$lib/layout/Divider.svelte"
import Button from "$lib/com/button/Button.svelte"
import AlbumHero from "$lib/com/album/AlbumHero.svelte"
import AlbumHeroMobile from "$lib/com/album/AlbumHeroMobile.svelte"
import TrackActions from "$lib/com/track/TrackActions.svelte"
import PortableText from "$lib/layout/PortableText.svelte"

// props
export let data


// reactives
$: album = data.album
$: shareable = createAlbumShare( data.album )

const playAlbum = album => e => {
    gtmSendPlayAlbum( { album: album.name } )
    queueReplaceThenPlay( album.tracks )
}

const playTrack = track => e => {
    gtmSendPlayTrack( { track: track.name, album: track.album.name } )
    queueThenPlay( [ track ] )
}
</script>

<MetaTags tags={data.meta}/>


<Contained>
    <section id="album-hero">
        <AlbumHeroMobile {album}/>
        <AlbumHero {album}/>
    </section>

    <section id="album-actions" class="flex items-center justify-between my-4">
        <div class="flex items-center group">
            <Button tid="play-album-tracks"
                    size="md"
                    shape="circle"
                    icon="mdi:play"
                    classes="group-hover:text-primary"
                    on:click={playAlbum(album)}/>
            <button type="button" class="group-hover:text-primary"
                    on:click={playAlbum(album)}>Play all
            </button>
        </div>
        <ShareButton {shareable}/>
    </section>

    <section id="album-tracklist" class="p-2">
        {#if album.tracks}

            <div class="flex flex-col space-y-2">
                {#each album.tracks as track, n }
                    <div class="flex items-center space-x-2">
                        <button id="track-details" class="ghost flex-1 flex items-center cursor-pointer hover:text-primary mr-6"
                                on:click={playTrack(track)}>
                            <span class="flex-none flex items-center justify-center h-8 w-8 mr-4 text-xs">{n + 1}</span>
                            <span class="flex-1 text-sm text-left">{track.name}</span>
                        </button>

                        <div id="track-actions" class="flex-none">
                            <TrackActions {track}/>

                        </div>
                    </div>
                {/each}
            </div>

        {/if}
    </section>

    {#if album.body}
        <Divider/>
        <PortableText text={album.body}/>
    {/if}
</Contained>

<ContentEnd/>

<IfDebug value={data.album}/>
<script>
import { queueManyThenPlay, queueOneThenPlay } from "$lib/actions.js"
import { createAlbumShare } from "$lib/model/share-factory.js"

// com
import Prose from "$lib/layout/Prose.svelte"
import IfDebug from "$lib/com/util/IfDebug.svelte"
import TracksDuration from "$lib/com/track/TracksDuration.svelte"
import MoreButton from "$lib/com/button/MoreButton.svelte"
import AlbumCard from "$lib/com/album/AlbumCard.svelte"
import AlbumType from "$lib/com/album/AlbumType.svelte"
import ShareButton from "$lib/com/share/ShareButton.svelte"
import PlayButton from "$lib/com/transport/button/PlayButton.svelte"
import MetaTags from "$lib/com/seo/MetaTags.svelte"
import Contained from "$lib/layout/Contained.svelte"
import ContentEnd from "$lib/layout/ContentEnd.svelte"
import Divider from "$lib/layout/Divider.svelte"

// props
export let data

// reactives
$: album = data.album
$: shareable = createAlbumShare( data.album )
</script>

<MetaTags tags={data.meta}/>

<Contained>

    <section id="album-hero" class="h-[100vw]">
        <AlbumCard {album}>
            <div slot="header">
                <p class="text-xs">
                    <AlbumType type={album.type}/>
                    &bull; {album.tracks.length} tracks
                    &bull;
                    <TracksDuration tracks={album.tracks}/>
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
        <ShareButton {shareable}/>
    </section>

    <section id="album-tracklist" class="p-2">
        {#if album.tracks}

            <div class="flex flex-col space-y-2">
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

        {/if}
    </section>

    <Divider/>

    <Prose>
        <h2>Lorem ipsum dolor sit amet consectetuer adipiscing elit</h2>

        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci autem beatae debitis ducimus eius eos hic illum ipsa laboriosam mollitia necessitatibus nesciunt odio possimus quo quos saepe sed, tempore ut.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci autem beatae debitis ducimus eius eos hic illum ipsa laboriosam mollitia necessitatibus nesciunt odio possimus quo quos saepe sed, tempore ut.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci autem beatae debitis ducimus eius eos hic illum ipsa laboriosam mollitia necessitatibus nesciunt odio possimus quo quos saepe sed, tempore ut.</p>
        <ul>
            <li>Lorem ipsum dolor sit amet consectetuer.</li>
            <li>Aenean commodo ligula eget dolor.</li>
            <li>Aenean massa cum sociis natoque penatibus.</li>
        </ul>

        <h3>Aenean commodo ligula eget dolor aenean massa</h3>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing
            elit. Aenean commodo ligula eget dolor. Aenean massa.
            Cum sociis natoque penatibus et magnis dis parturient
            montes, nascetur ridiculus mus. Donec quam felis,
            ultricies nec, pellentesque eu, pretium quis, sem.</p>

        <blockquote>
            Lorem ipsum dolor sit amet, consectetuer
            adipiscing elit. Aenean commodo ligula eget dolor.
            Aenean massa <strong>strong</strong>. Cum sociis
            natoque penatibus et magnis dis parturient montes,
            nascetur ridiculus mus. Donec quam felis, ultricies
            nec, pellentesque eu, pretium quis, sem. Nulla consequat
            massa quis enim. Donec pede justo, fringilla vel,
            aliquet nec, vulputate eget, arcu. In <em>em</em>
            enim justo, rhoncus ut, imperdiet a, venenatis vitae,
            justo. Nullam <a class="external ext" href="#">link</a>
            dictum felis eu pede mollis pretium.
        </blockquote>


    </Prose>

    <Prose>
        <h2>Lorem ipsum dolor sit amet consectetuer adipiscing
            elit</h2>

        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing
            elit. Aenean commodo ligula eget dolor. Aenean massa
            <strong>strong</strong>. Cum sociis natoque penatibus
            et magnis dis parturient montes, nascetur ridiculus
            mus. Donec quam felis, ultricies nec, pellentesque
            eu, pretium quis, sem. Nulla consequat massa quis
            enim. Donec pede justo, fringilla vel, aliquet nec,
            vulputate eget, arcu. In enim justo, rhoncus ut,
            imperdiet a, venenatis vitae, justo. Nullam dictum
            felis eu pede <a class="external ext" href="#">link</a>
            mollis pretium. Integer tincidunt. Cras dapibus.
            Vivamus elementum semper nisi. Aenean vulputate
            eleifend tellus. Aenean leo ligula, porttitor eu,
            consequat vitae, eleifend ac, enim. Aliquam lorem ante,
            dapibus in, viverra quis, feugiat a, tellus. Phasellus
            viverra nulla ut metus varius laoreet. Quisque rutrum.
            Aenean imperdiet. Etiam ultricies nisi vel augue.
            Curabitur ullamcorper ultricies nisi.</p>
        <h1>Lorem ipsum dolor sit amet consectetuer adipiscing
            elit</h1>
        <h3>Aenean commodo ligula eget dolor aenean massa</h3>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing
            elit. Aenean commodo ligula eget dolor. Aenean massa.
            Cum sociis natoque penatibus et magnis dis parturient
            montes, nascetur ridiculus mus. Donec quam felis,
            ultricies nec, pellentesque eu, pretium quis, sem.</p>
        <h2>Aenean commodo ligula eget dolor aenean massa</h2>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing
            elit. Aenean commodo ligula eget dolor. Aenean massa.
            Cum sociis natoque penatibus et magnis dis parturient
            montes, nascetur ridiculus mus. Donec quam felis,
            ultricies nec, pellentesque eu, pretium quis, sem.</p>
        <ul>
            <li>Lorem ipsum dolor sit amet consectetuer.</li>
            <li>Aenean commodo ligula eget dolor.</li>
            <li>Aenean massa cum sociis natoque penatibus.</li>
        </ul>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing
            elit. Aenean commodo ligula eget dolor. Aenean massa.
            Cum sociis natoque penatibus et magnis dis parturient
            montes, nascetur ridiculus mus. Donec quam felis,
            ultricies nec, pellentesque eu, pretium quis, sem.</p>

        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing
            elit. Aenean commodo ligula eget dolor. Aenean massa.
            Cum sociis natoque penatibus et magnis dis parturient
            montes, nascetur ridiculus mus. Donec quam felis,
            ultricies nec, pellentesque eu, pretium quis, sem.</p>
        <table class="data">
            <tr>
                <th>Entry Header 1</th>
                <th>Entry Header 2</th>
                <th>Entry Header 3</th>
                <th>Entry Header 4</th>
            </tr>
            <tr>
                <td>Entry First Line 1</td>
                <td>Entry First Line 2</td>
                <td>Entry First Line 3</td>
                <td>Entry First Line 4</td>
            </tr>
            <tr>
                <td>Entry Line 1</td>
                <td>Entry Line 2</td>
                <td>Entry Line 3</td>
                <td>Entry Line 4</td>
            </tr>
            <tr>
                <td>Entry Last Line 1</td>
                <td>Entry Last Line 2</td>
                <td>Entry Last Line 3</td>
                <td>Entry Last Line 4</td>
            </tr>
        </table>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing
            elit. Aenean commodo ligula eget dolor. Aenean massa.
            Cum sociis natoque penatibus et magnis dis parturient
            montes, nascetur ridiculus mus. Donec quam felis,
            ultricies nec, pellentesque eu, pretium quis, sem.</p>
    </Prose>

</Contained>

<ContentEnd/>

<IfDebug value={data.album}/>
<script>
import { goto } from "$app/navigation.js"
import { route } from "$lib/config/routes.js"
import { queueReplaceThenPlay } from "$lib/actions.js"
import { imageUrl } from "$lib/service/sanity-client.js"
//com
import Button from "$lib/com/button/Button.svelte"
import TracksDuration from "$lib/com/track/TracksDuration.svelte"
import BackgroundImage from "$lib/com/BackgroundImage.svelte"

// props
export let track
export let onClick = () => goto( route( '@album', track.album ) )
</script>
{#if track}
    <div class="relative w-full h-full md:drop-shadow">

        <!-- CardLinkOverlay -- pass in prop onClick to override -->
        <a class="z-[4] absolute w-full h-full inset-0 cursor-pointer" href={route('@album', track.album)} on:click|preventDefault={onClick}></a>

        <!-- CardContentWrapper -->
        <div class="relative flex flex-col h-full justify-between">

            <!-- CardHeader -->
            <div class="z-[2] bg-gradient-to-b h-1/2 from-black/40">
                <div class="card-header text-white p-4 flex flex-col">
                    <a class="text-2xl">{track.name}</a>
                    <p class="mt-1 text-xs">
                        Track &bull;
                        <TracksDuration tracks={[track]}/>
                    </p>
                </div>

                {#if $$slots.default}
                    <!-- CardContent -->
                    <div class="card-content">
                        <slot/>
                    </div>
                {/if}
            </div>

            <!-- CardFooter -->
            <div class="relative z-[6] bg-gradient-to-t from-black/10 flex items-end">
                <div class="z-[6] relative w-full p-4 text-white flex items-center space-x-1 justify-between">
                    <div>
                        <Button shape="circle" color="ghost" size="sm" on:click={() => queueReplaceThenPlay(track)} icon="mdi:play" classes="text-white"/>
                        <!--                        <Button shape="circle" color="ghost" size="sm" on:click={()=>confirm('share?')} icon="mdi:heart-outline"/>-->
                    </div>
                    <Button shape="circle" color="ghost" size="sm" on:click={()=>confirm('share?')} icon="mdi:export-variant"/>
                </div>
            </div>
        </div>

        <!-- CardBackgroundImage -->
        <BackgroundImage url={imageUrl(track.album.poster, {width:1200,height:1200, auto:'format'})}/>
    </div>
{/if}

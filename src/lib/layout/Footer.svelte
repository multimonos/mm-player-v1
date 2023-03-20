<script>
import { service } from "$lib/state-machine/app-machine.js"
import { PauseEvent, PlayEvent, SkipBackwardEvent, SkipForwardEvent } from "$lib/state-machine/events.js"
import { LoadingTag, PlayingTag } from "$lib/state-machine/tags.js"
import { pause, play, skipBackward, skipForward } from "$lib/actions.js"
import { toggleDrawer } from "$lib/stores.js"
import NowPlaying from "$lib/com/NowPlaying.svelte"
import DrawerToggle from "$lib/com/button/DrawerToggle.svelte"
import ScreenshotButton from "$lib/com/button/ScreenshotButton.svelte"
import Transport from "$lib/com/transport/Transport.svelte"
import MobileProgressBar from "$lib/com/transport/MobileProgressBar.svelte"
import DesktopProgressBar from "$lib/com/transport/DesktopProgressBar.svelte"
</script>


<footer class="btm-nav z-20 border-t-[1px] border-white/10 md:h-20">
    <div class="lg:container lg:mx-auto">

        {#if $service.hasTag( PlayingTag )}
            <div class="absolute w-full top-0 overflow-x-hidden md:hidden">
                <MobileProgressBar value={$service.context.progress} max={$service.context?.track?.duration || 0}/>
            </div>
        {/if}

        <div class="w-full h-full flex flex-row items-center justify-between gap-1 px-1 md:px-2">

            <!-- left -->
            <div class="pl-1 md:flex-[0_0_33%] xl:flex-[0_0_33%] xl:mr-0 ">
                <NowPlaying track={$service.context?.track} on:click={()=>toggleDrawer()}/>
            </div>


            <!-- right -->
            <div class="flex-1 flex flex-row justify-end items-center ">

                <!-- TransportWrapper -->
                <div class="md:flex-[1_0_33%]">
                    <div class="md:flex md:flex-col md:items-center">
                        <div class="flex flex-row md:gap-1">
                            <Transport
                                    isLoading={$service.hasTag(LoadingTag)}
                                    canPause={$service.can(PauseEvent)}
                                    canPlay={$service.can(PlayEvent)}
                                    canSkipForward={$service.can(SkipForwardEvent)}
                                    canSkipBackward={$service.can(SkipBackwardEvent)}
                                    on:play={() => play()}
                                    on:pause={() => pause()}
                                    on:skip-forward={() => skipForward()}
                                    on:skip-backward={() => skipBackward()}
                            />
                        </div>

                        <DesktopProgressBar value={$service.context.progress} max={$service.context?.track?.duration || 0}/>
                    </div>
                </div>

                <!-- OtherControlsWrapper -->
                <div class="flex flex-row gap-1 md:flex-[1_0_33%] md:justify-end">
                    <ScreenshotButton/>
                    <DrawerToggle/>
                </div>
            </div>

        </div>

    </div>
</footer>
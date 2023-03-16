<script>
import { service } from "$lib/state-machine/app-machine.js"
import { PauseEvent, PlayEvent, SkipBackwardEvent, SkipForwardEvent } from "$lib/state-machine/events.js"
import { LoadingTag, PlayingTag } from "$lib/state-machine/tags.js"
import { pause, play, skipBackward, skipForward } from "$lib/actions.js"
import NowPlaying from "$lib/com/NowPlaying.svelte"
import QueueButton from "$lib/com/button/QueueButton.svelte"
import Transport from "$lib/com/transport/Transport.svelte"
import Contained from "$lib/layout/Contained.svelte"
import MobileProgressBar from "$lib/com/transport/MobileProgressBar.svelte"
</script>


<footer class="btm-nav z-20 border-t-[1px] border-white/10 md:h-24">
    <Contained>

            {#if $service.hasTag( PlayingTag )}
                <div class="absolute w-full top-0 overflow-x-hidden">
                    <MobileProgressBar value={$service.context.progress} max={$service.context?.track?.duration || 0}/>
                </div>
            {/if}

        <div class="w-full h-full flex flex-row items-center justify-between gap-1 px-1" >

            <!-- left -->
            <div class="md:w-[40%]">
                <NowPlaying track={$service.context?.track}/>
            </div>


            <!-- right -->
            <div class="flex-1 flex flex-row justify-end h-full items-center">
                <Transport
                        isLoading={$service.hasTag(LoadingTag)}
                        canPause={$service.can(PauseEvent)}
                        canPlay={$service.can(PlayEvent)}
                        canSkipForward={$service.can(SkipForwardEvent)}
                        canSkipBackward={$service.can(SkipBackwardEvent)}
                        on:play={play}
                        on:pause={pause}
                        on:skip-forward={skipForward}
                        on:skip-backward={skipBackward}
                />
                <QueueButton q={$service.context.q}/>
            </div>

        </div>

    </Contained>
</footer>
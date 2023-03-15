<script>
import { service } from "$lib/state-machine/app-machine.js"
import { PauseEvent, PlayEvent, SkipBackwardEvent, SkipForwardEvent } from "$lib/state-machine/events.js"
import { LoadingTag } from "$lib/state-machine/tags.js"
import { pause, play, skipBackward, skipForward } from "$lib/actions.js"
import NowPlaying from "$lib/com/NowPlaying.svelte"
import QueueButton from "$lib/com/button/QueueButton.svelte"
import Transport from "$lib/com/transport/Transport.svelte"
import Contained from "$lib/layout/Contained.svelte"
</script>


<footer class="btm-nav z-20 border-t-[1px] border-white/10">

    <Contained>

        <div class="absolute top-0 left-[-1%] h-1 w-[102%] overflow-x-hidden">
            <progress class="progress progress-primary" value={$service.context.progress} max={$service.context?.track?.duration || 0}></progress>
        </div>

        <div class="w-full flex flex-row items-center justify-between">

            <div class="flex-none pl-2 md:pl-0">
                <NowPlaying track={$service.context?.track}/>
            </div>

            <div class="flex-1 flex flex-row justify-end">

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
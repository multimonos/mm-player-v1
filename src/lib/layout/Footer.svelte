<script>
import { service } from "$lib/state-machine/app-machine.js"
import { PauseEvent, PlayEvent, SkipBackwardEvent, SkipForwardEvent } from "$lib/state-machine/events.js"
import { LoadingTag } from "$lib/state-machine/tags.js"
import { pause, play, skipForward, skipBackward } from "$lib/actions.js"
import NowPlaying from "$lib/com/NowPlaying.svelte"
import QueueButton from "$lib/com/button/QueueButton.svelte"
import Transport from "$lib/com/transport/Transport.svelte"
</script>

<footer class="btm-nav justify-between">
    <div class="absolute top-0 left-[-1%] h-1 w-[102%]">
        <progress class="progress progress-primary" value={$service.context.progress} max={$service.context?.track?.duration || 0}></progress>
    </div>

    <div class="flex flex-row items-center justify-between px-2">

        <div class="flex-[0_0_55%]">
            <NowPlaying track={$service.context?.track}/>
        </div>

        <div class="flex-[0_0_45%] flex flex-row justify-end space-x-2">

            <Transport
                    isLoading={$service.hasTag(LoadingTag)}
                    canPause={$service.can(PauseEvent)}
                    canPlay={$service.can(PlayEvent)}
                    canSkipNext={$service.can(SkipForwardEvent)}
                    canSkipPrevious={$service.can(SkipBackwardEvent)}
                    on:play={play}
                    on:pause={pause}
                    on:skip-next={skipForward}
                    on:skip-previous={skipBackward}
            />

            <QueueButton q={$service.context.q}/>

        </div>
    </div>
</footer>
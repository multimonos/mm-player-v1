<script>
import { service } from "$lib/state-machine/app-machine.js"
import { PauseEvent, PlayEvent, QueueNextEvent, QueuePreviousEvent } from "$lib/state-machine/events.js"
import { LoadingTag } from "$lib/state-machine/tags.js"
import NowPlaying from "$lib/com/NowPlaying.svelte"
import QueueButton from "$lib/com/button/QueueButton.svelte"
import Transport from "$lib/com/transport/Transport.svelte"

//fns
const play = () => service.send( { type: PlayEvent } )
const pause = () => service.send( { type: PauseEvent } )
const resume = () => service.send( { type: ResumeEvent } )
const skipNext = () => service.send( { type: QueueNextEvent } )
const skipPrevious = () => service.send( { type: QueuePreviousEvent } )

</script>

<footer class="btm-nav justify-between">
    <progress class="progress progress-primary absolute top-0 h-1 w-full"
              value={$service.context.progress}
              max={$service.context?.track?.duration || 0}></progress>

    <div class="flex flex-row items-center justify-between px-2">

        <div class="flex-[0_0_55%]">
            <NowPlaying track={$service.context?.track}/>
        </div>

        <div class="flex-[0_0_45%] flex flex-row justify-end space-x-1">
            <Transport
                    isLoading={$service.hasTag(LoadingTag)}
                    canPause={$service.can(PauseEvent)}
                    canPlay={$service.can(PlayEvent)}
                    canSkipNext={$service.can(QueueNextEvent)}
                    canSkipPrevious={$service.can(QueuePreviousEvent)}
                    on:play={play}
                    on:pause={pause}
                    on:skip-next={skipNext}
                    on:skip-previous={skipPrevious}
            />

            <QueueButton q={$service.context.q}/>

        </div>
    </div>
</footer>
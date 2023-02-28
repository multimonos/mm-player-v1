<script>
import { fy } from "$lib/util/string.js"
import { debug } from "$lib/stores.js"
// a "heads up widget" for the test framework
export let svc

// The `props` are values that you can wait for ... with await page.locator("[data-queue-count=2]")
// The `input[type=hidden]` elements contain values to check the current state
$:debugClasses = $debug ? 'absolute bottom-0 right-0 w-full' : ''
$:props = {
    // svc states
    'data-player-state': svc.value.player,
    'data-audio-state': svc.context.audioContext?.state,
    'data-timer-state': svc.value.timer,
    'data-queue-state': svc.value.queue,
    'data-toasts-state': svc.value.toasts,

    'data-queue-count': svc.context.q.length,
    'data-history-count': svc.context.h.length,
    'data-toasts-count': svc.context.toasts.length,
    'data-now-playing-count': svc.context.track === null ? 0 : 1,

    // other
}
</script>
<div data-tid="svc-test" {...props} class="{debugClasses}">
    <!-- states -->
    <input data-tid="player-state" type="hidden" value={svc.value.player}/>
    <input data-tid="audio-context-state" type="hidden" value={svc.context.audioContext?.state}/>
    <input data-tid="timer-state" type="hidden" value={svc.value.timer}/>
    <input data-tid="queue-state" type="hidden" value={svc.value.queue}/>
    <input data-tid="toasts-state" type="hidden" value={svc.value.toasts}/>
    <!-- counts -->
    <input data-tid="queue-count" type="hidden" value={svc.context.q.length}/>
    <input data-tid="history-count" type="hidden" value={svc.context.h.length}/>
    <input data-tid="toasts-count" type="hidden" value={svc.context.toasts.length}/>
    <input data-tid="now-playing-count" type="hidden" value={svc.context.track === null ? 0 : 1}/>

    {#if $debug}
        <pre class="mb-32">{fy( props )}</pre>
    {/if}
</div>

<script>
import {fy} from "$lib/util/string.js"
import { debug } from "$lib/stores.js"
// a "heads up widget" for the test framework
export let svc

// reactives
$:props = {
    // svc states
    'data-player-state': svc.value.player,
    'data-timer-state': svc.value.timer,
    'data-queue-state': svc.value.queue,
    'data-toasts-state': svc.value.toasts,

    // counts
    'data-queue-count': svc.context.q.length,
    'data-history-count': svc.context.h.length,
    'data-toasts-count': svc.context.toasts.length,
    'data-now-playing-count': svc.context.track === null ? 0: 1,

    // other
}
</script>
<div data-tid="svc-test" {...props}>
    {#if debug}<pre class="mb-32">{fy(props)}</pre>{/if}
</div>

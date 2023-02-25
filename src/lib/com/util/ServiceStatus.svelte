<script>
// a "heads up widget" for the test framework
export let svc

// reactives
$:props = {
    // player
    'data-player-state': svc.value.player,
    'data-timer-state': svc.value.timer,
    // queue
    'data-queue-state': svc.value.queue,
    'data-queue-count': svc.context.q.length,
    // history
    'data-history-count': svc.context.h.length,
    // toasts
    'data-toasts-state': svc.value.toasts,
    'data-toasts-count': svc.context.toasts.length,
}
</script>
<div {...props}>
   <slot/>
</div>

<script>
import { service } from "$lib/state-machine/app-machine.js"
import { fy } from "$lib/util/string.js"


$:isEmpty = $service.context.q.length === 0
</script>

queue

{#if isEmpty}
    <code>empty</code>
    <p>you should add something to your queue!</p>
{:else}
    {fy( $service.context.q )}
{/if}


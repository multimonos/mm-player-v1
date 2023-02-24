<script>
import { debug } from "$lib/stores"
import Icon from "$lib/com/icon/Icon.svelte"

const toggle = () => $debug = ! $debug

console.log( 'debug', $debug )
</script>
<button class="btn btn-sm" class:text-error={$debug} on:click={toggle}>
    <Icon icon="mdi:bug" size="sm"/>
</button>
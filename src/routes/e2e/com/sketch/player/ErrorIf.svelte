<script>
import Error from "./Error.svelte";
export let msg
export let tid
export let test = false

$ : result = typeof test === "function"
    ? test()
    : true && test
</script>
{#if result}
    <Error {tid} {msg}/>
{/if}

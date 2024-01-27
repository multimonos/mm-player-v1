<script>
export let tid
export let enabled
</script>
<button
    data-tid={tid}
    disabled={!enabled}
    on:click
    class:btn-disabled={!enabled}
    class="btn btn-ghost btn-xs text-black hover:bg-pink-400"
>
    <slot/>
</button>

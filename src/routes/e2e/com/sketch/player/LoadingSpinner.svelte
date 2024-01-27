<script>
export let visible = false
</script>
{#if visible}
    <div data-tid="sketch-loading" class="z-20 absolute inset-0 flex justify-center items-center bg-black/10">
        <div class="bg-white/40 flex items-center rounded-full p-2">
            <span class="loading loading-spinner loading-md text-black"></span>
        </div>
    </div>
{/if}

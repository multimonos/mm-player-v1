<script>
    import { fly } from "svelte/transition"


    export let errors = []
    let dismissed = []
    const dismiss = id => e => {
        dismissed = [...dismissed, id]

    }
</script>
{#if errors.length > 0}
    <div class="toast">
        {#each errors as e}
            {#if ! dismissed.includes( e.id )}
                <div class="alert alert-error cursor-pointer" out:fly={{x:500}} on:click={dismiss(e.id)}>
                    <div>
                        <span>{e?.message}</span>
                        <span>{e?.id}</span>
                    </div>
                </div>
            {/if}
        {/each}
    </div>
{/if}
<script>
    import { fly } from "svelte/transition"


    export let toasts = []

    $:    console.log( '<Toasts/>', { toasts } )
</script>
{#if toasts.length > 0}
    <div class="toast">
        {#each toasts as toast}
            <div class="alert cursor-pointer"
                 class:alert-error={toast.type.includes("error")}
                 class:alert-success={toast.type.includes("success")}
                 out:fly={{x:500, duration:750}}>
                <div>
                    <span>{toast.data?.message}</span>
                </div>
            </div>
        {/each}
    </div>
{/if}
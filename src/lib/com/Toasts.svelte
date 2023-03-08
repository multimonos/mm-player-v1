<script>
import { fly } from "svelte/transition"


export let toasts = []

// $:    console.log( '<Toasts/>', { toasts } )
</script>
{#if toasts.length > 0}
    <div class="toast z-50">
        {#each toasts as toast}
            <div class="alert cursor-pointer"
                 class:alert-error={toast?.status==="error"}
                 class:alert-success={toast?.status==="success"}
                 out:fly={{x:500, duration:750}}>
                <div>
                    <span>{toast.message}</span>
                </div>
            </div>
        {/each}
    </div>
{/if}
<script>
import Icon from "$lib/com/icon/Icon.svelte"

// props
export let icon = null
export let iconSize = 'sm'
</script>
<button type="button" class="btn btn-xs btn-ghost flex gap-2 flex-nowrap items-center hover:text-primary" on:click>
    {#if icon}
        <Icon {icon} size={iconSize}/>
    {/if}
    <span class="whitespace-nowrap normal-case font-normal"><slot/></span>
</button>
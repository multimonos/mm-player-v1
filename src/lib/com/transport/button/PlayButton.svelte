<script>
import Button from "$lib/com/button/Button.svelte"
import Icon from "$lib/com/icon/Icon.svelte"


export let enabled = false
export let size="md"
</script>


<Button tid="play-btn" {size} shape="circle" disabled={!enabled} classes="hover:text-primary md:btn-sm" on:click>
    <Icon icon="mdi:play" size="sm"/>
</Button>
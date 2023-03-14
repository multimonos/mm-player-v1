<script>
import Button from "$lib/com/button/Button.svelte"

    import Icon from "$lib/com/icon/Icon.svelte"


    export let enabled = false
</script>

<Button tid="skip-next-btn" shape="circle" disabled={!enabled} classes="hover:text-primary" on:click>
    <Icon icon="mdi:skip-next" size="sm"/>
</Button>

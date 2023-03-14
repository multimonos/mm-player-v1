<script>
import Button from "$lib/com/button/Button.svelte"
    import Icon from "$lib/com/icon/Icon.svelte"


    export let enabled = false
</script>

<Button tid="skip-previous-btn" shape="circle" disabled={!enabled} classes="hover:text-primary" on:click>
    <Icon icon="mdi:skip-previous" size="sm"/>
</Button>
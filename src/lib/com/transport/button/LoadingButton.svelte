<script>
import Button from "$lib/com/button/Button.svelte"
    import Icon from "$lib/com/icon/Icon.svelte"
</script>
<Button tid="loading-btn" shape="circle" classes="animate-spin" on:click>
    <Icon icon="mdi:loading" size="sm"/>
</Button>

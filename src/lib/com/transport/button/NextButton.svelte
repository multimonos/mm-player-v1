<script>
    import Icon from "$lib/com/icon/Icon.svelte"


    export let enabled = false
</script>

<button data-tid="skip-next-btn" type="button" class="btn btn-circle btn hover:text-accent" disabled={!enabled} on:click>
    <Icon icon="mdi:skip-next" size="sm"/>
</button>

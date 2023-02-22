<script>
    import Icon from "$lib/com/Icon.svelte"


    export let enabled = false
</script>

<button data-cy="skip-previous-btn" type="button" class="btn btn-circle btn-sm hover:text-accent" disabled={!enabled} on:click>
    <Icon icon="mdi:skip-previous"/>
</button>
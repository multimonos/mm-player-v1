<script>
    import Icon from "$lib/com/icon/Icon.svelte"


    export let enabled = false
</script>

<button data-tid="pause-btn" type="button" class="btn btn-circle btn hover:text-accent" on:click disabled={!enabled}>
    <Icon icon="mdi:pause" size="sm"/>
</button>
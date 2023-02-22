<script>
    import Icon from "$lib/com/Icon.svelte"

    //props
    export let size = 'sm'
    export let enabled = false
</script>


<button data-cy="play-btn" type="button" class="btn btn-circle btn-{size} hover:text-accent" on:click disabled={!enabled}>
    <Icon icon="mdi:play" { size }/>
</button>
<script>
export let url = null
export let color = null
</script>

<div data-tid="sketch-poster" class="flex justify-center">
    {#if (url)}
        <div data-tid="sketch-poster-image" class="aspect-video">
            <img src={url} alt="Sketch poster"/>
        </div>
    {/if}

    {#if color }
        <div data-tid="sketch-poster-color" class="flex bg-[{color}]">&nbsp;</div>
    {/if}
</div>
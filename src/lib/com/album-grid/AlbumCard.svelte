<script>
import BackgroundImage from "$lib/com/album-grid/cell/BackgroundImage.svelte"


export let album
</script>
{#if album}

<div class="w-full h-full relative">

    <div class="card-content flex flex-col z-10 relative h-full justify-between">
        <div class="card-header">
<!--            <h1 class="text-xl">{album.text}</h1>-->
            <p class="text-5xl text-center font-bold text-blue-600 flex items-center justify-center h-full">{album.id}</p>
<!--            <pre class="overflow-hidden flex w-40 h-32">{JSON.stringify(album, null,2)}</pre>-->
        </div>

        <div class="card-footer flex items-center h-16">
            <p>hi</p>
            <p>bye</p>
            <p>again</p>
        </div>
    </div>


    <!-- BackgroundImage -->
    <div class="absolute w-full h-full overflow-hidden inset-0 bg-no-repeat bg-cover bg-[50%]">
        <figure class="absolute w-full h-full inset-0 bg-no-repeat bg-cover bg-[50%] bg-transparent" style="background-image: url({album?.image})"/>
    </div>
</div>

{/if}

<script>
import { queue } from "$lib/actions.js"
import { createTrackShare } from "$lib/model/share-factory.js"
import Button from "$lib/com/button/Button.svelte"
import TinyButton from "$lib/com/button/TinyButton.svelte"
import ShareButtonTiny from "$lib/com/share/ShareButtonTiny.svelte"


export let track

</script>


<div class="dropdown dropdown-left bg-">
    <label tabindex="0">
        <Button icon="mdi:dots-vertical" size="sm" shape="circle"/>
    </label>
    <ul tabindex="0" class="dropdown-content p-2 shadow bg-black rounded-box w-32 flex flex-col gap-2">
        <li>
            <TinyButton icon="mdi:playlist-plus" on:click={queue(track)}>Add to queue</TinyButton>
        </li>
        <li>
            <ShareButtonTiny shareable={createTrackShare(track)}>Share track</ShareButtonTiny>
        </li>
    </ul>
</div>
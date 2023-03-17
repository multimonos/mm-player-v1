<script>
import { service } from "$lib/state-machine/app-machine.js"
import { ScreenshotEvent } from "$lib/state-machine/events.js"
import Button from "$lib/com/button/Button.svelte"
import Icon from "$lib/com/icon/Icon.svelte"
import { PlayingTag } from "$lib/state-machine/tags.js"

</script>
<Button tid="queue-btn"
        shape="circle"
        disabled={!$service.hasTag(PlayingTag)}
        on:click={()=>service.send(ScreenshotEvent)}
        classes="hidden sm:inline-flex hover:text-primary md:btn-sm">
    <Icon icon="mdi:camera" size="sm"/>
</Button>

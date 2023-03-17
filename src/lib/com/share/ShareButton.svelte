<script>
import Button from "$lib/com/button/Button.svelte"
import Icon from "$lib/com/icon/Icon.svelte"
import { share } from "$lib/com/share/sharing.js"


// props
export let shareable
export let classes = 'text-white'
export let iconSize = 'sm'

// vars
const hasContent = $$slots.default
const shape = hasContent ? 'default' : 'circle'

// derived
classes += hasContent ? ' flex gap-2 ' : ''
</script>

<Button { shape } color="ghost" {classes} on:click={()=>share(shareable)}>
    <Icon icon="mdi:export-variant" size={iconSize}/>
    <slot/>
</Button>

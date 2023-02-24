<script>
import { fy } from "$lib/util/string.js"

// props
export let name
export let value
export let expanded = false

//fns
const toggle = () => expanded = ! expanded
</script>

<div tabindex="0"
     class="collapse collapse-plus border border-base-300 bg-base-100 rounded-box"
     class:collapse-open={expanded}
     class:collapse-close={!expanded}
     on:click={toggle}
>
    <div class="collapse-title text-xl font-medium">
        {name}
    </div>
    <div class="collapse-content" >
        <pre>{fy( value )}</pre>
    </div>
</div>
<script>
import Navigation from "./Navigation.svelte";
import { sketchurl } from "./test-helper.js";
</script>

<div class="container">

    <code class="absolute right-0 text-sm text-neutral-content/50">Sketch API: {sketchurl( `/` )}</code>

    <div class="mx-2 flex flex-col">
        <Navigation/>
    </div>

    <slot/>
</div>

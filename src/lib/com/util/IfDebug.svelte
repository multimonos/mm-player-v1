<script>
import { debug } from "$lib/stores.js"
import {fy} from "$lib/util/string.js"
export let value
</script>
{#if $debug}
<pre class="mt-8">
   {fy(value)}
</pre>
{/if}
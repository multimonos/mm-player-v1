<script>
import { route } from "$lib/config/routes.js"

// fns
</script>
<ul class="menu p-4 w-80 bg-base-100 text-base-content" on:click>
    <li><a href={route('@home')}>home</a></li>
    <li><a href="">collections</a></li>
    <li><a href={route('@queue')}>queue</a></li>
    <li><a href="/testing/layout">layout</a></li>
    <li><a href="/testing/state">state</a></li>
</ul>
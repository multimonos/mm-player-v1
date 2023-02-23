<script>
import { route } from "$lib/config/routes.js"
</script>
<ul class="menu p-4 w-80 bg-base-100 text-base-content">
    <li><a href={route('@home')} on:click>home</a></li>
    <li><a href={route('@albums')} on:click>albums</a></li>
    <li><a href={route('@queue')} on:click>queue</a></li>
    <li><a href={route('@debug')} on:click>debug</a></li>
</ul>
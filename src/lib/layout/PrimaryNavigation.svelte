<script>
import { route } from "$lib/config/routes.js"
</script>
<ul class="menu menu-compact flex flex-col p-0 px-4">
    <li><a class="flex gap-4" href={route('@home')} on:click>home</a></li>
    <li><a class="flex gap-4" href={route('@albums')} on:click>albums</a></li>
    <li><a class="flex gap-4" href={route('@debug')} on:click>debug</a></li>
</ul>
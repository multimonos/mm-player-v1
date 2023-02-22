<script>
/**
 * !!! keep layout at this level if possible !!!
 */
import { route } from "$lib/config/routes.js"
// com
import Transport from "$lib/com/transport/Transport.svelte"
import Lorem from "$lib/com/util/Lorem.svelte"
import NowPlaying from "$lib/com/NowPlaying.svelte"
import QueueButton from "$lib/com/button/QueueButton.svelte"
</script>

<div class="drawer">

    <input id="my-drawer" type="checkbox" class="drawer-toggle"/>

    <div class="drawer-content">

        <nav class="navbar sticky top-0 bg-base-100">
            <div class="flex-none">
                <label for="my-drawer" class="btn btn-square btn-ghost drawer-button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </label>
            </div>
            <div class="flex-1">
                <a class="btn btn-ghost normal-case text-xl">multimonos</a>
            </div>
            <div class="flex-none">
                <button class="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                    </svg>
                </button>
            </div>
        </nav>

        <main class="overflow-y-auto h-screen pb-32">
            <slot/>
            <Lorem count="10"/>
        </main>

        <footer class="btm-nav justify-between">
            <NowPlaying/>
            <div class="flex flex-row space-x-1">
                <Transport/>
                <QueueButton/>
            </div>
        </footer>

    </div>

    <aside class="drawer-side">
        <label for="my-drawer" class="drawer-overlay"></label>
        <ul class="menu p-4 w-80 bg-base-100 text-base-content">
            <li><a href={route('@home')}>home</a></li>
            <li><a href="">collections</a></li>
            <li><a href={route('@queue')}>queue</a></li>
            <li><a href="/testing/layout">layout</a></li>
            <li><a href="/testing/state">state</a></li>
        </ul>
    </aside>

</div>

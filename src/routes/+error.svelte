<script>
import {page} from "$app/stores"
</script>
<div class="hero h-screen items-start bg-base-200 py-16">
    <div class="hero-content flex-col lg:flex-row">
        <h1 class="text-5xl font-bold">{$page.status}</h1>
        <div class="max-w-md">
            <p class="py-6">{$page.error.message}</p>
        </div>
    </div>
</div>
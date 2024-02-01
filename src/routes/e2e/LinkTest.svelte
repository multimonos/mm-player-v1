<script>
export let test
</script>

<div class="mx-2 flex flex-col leading-tight">
    <p>
        <a href={test.url} class="link-hover">{test.name}</a>
        <a href={test.url} target="_top" alt="Reload top" class="link-hover ml-2">
            <iconify-icon icon="tabler:external-link"/>
        </a>
    </p>
    <p>
        <small class="text-neutral-content/40">{test.path}</small>
    </p>
</div>
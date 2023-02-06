<script>
    export let name
    export let value
</script>

<div class="stats shadow">
    <div class="stat">
        <div class="stat-title uppercase">{name}</div>
        <div
                class="stat-value text-xl"
                class:text-success={['enabled','playing'].includes(value)}
                class:text-warning={['loading'].includes(value)}
                class:text-error={['disabled'].includes(value)}
        >{value}</div>
    </div>
</div>
<script>
export let name
export let value
</script>

<div class="flex-1 bg-neutral-focus p-2 rounded shadow" data-tid="{name}-state--{value}">
    <div class="text-xs text-neutral-content/50 uppercase">{name}</div>
    <div class="text-sm"
         class:text-success={['enabled','playing', 'looping','paused'].includes(value)}
         class:text-warning={['loading'].includes(value)}
         class:text-info={['resolving'].includes(value)}
         class:text-error={['disabled'].includes(value)}
    >{value}</div>
</div>
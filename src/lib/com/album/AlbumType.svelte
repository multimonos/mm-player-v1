<script>
export let type

$: name = type[0].toUpperCase() + type.substring(1)
</script>
{name}

<script>
export let value = 0
export let max = 0

// percentage with 1 decimal precision
$:percent = Math.ceil( value / max * 1000 ) / 10
// $:{if(percent > 97)console.log('per',percent, value)}
</script>
<div class="h-[2px] w-full bg-neutral-200">
    <div class="h-[2px] bg-primary" style="width:{percent}%"></div>
</div>
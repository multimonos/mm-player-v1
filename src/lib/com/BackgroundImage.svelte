<script>
/**
 * Notes,
 * - requires a parent container like `<div class="relative w-full h-full">...</div>`
 * - content should be a sibling like `<div class="z-10 relative">...</div>
 */
export let zIndex = 1
export let url

// reactive
$:style = `background-image: url(${ url });`

</script>
<div class="z-[{zIndex}] absolute w-full h-full overflow-hidden inset-0 bg-no-repeat bg-cover bg-[50%]">
    <figure class="absolute w-full h-full inset-0 bg-no-repeat bg-cover bg-[50%] bg-transparent" { style }/>
</div>
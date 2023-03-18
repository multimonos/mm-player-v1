<script>
/**
 * Notes,
 * - requires a parent container like `<div class="relative w-full h-full">...</div>`
 * - content should be a sibling like `<div class="z-10 relative">...</div>
 *
 * From TailwindCSS
 * - Don't add `to-transparent` explicitly
 *
 * @see https://tailwindcss.com/docs/gradient-color-stops
 */
export let zIndex = 2  //should be greater than z-index of sibling BackgroundImage and less than z-index of sibling Content
export let gradient = 'bg-gradient-to-b from-black' // from-X via-Y to-Z
export let opacity = 'opacity-20'
</script>

<div class="z-[{zIndex}] absolute w-full h-full overflow-hidden inset-0 bg-no-repeat bg-cover bg-[50%] {gradient} {opacity}"></div>
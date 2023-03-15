<script>
import 'iconify-icon'


//props
export let icon
export let size = 'sm'

//sizes
let sizes = {
    xs: {
        width: 12,
        height: 12,
    },
    sm: {
        width: 18,
        height: 18,
    },
    md: {
        width: 32,
        height: 32,
    },
    lg: {
        width: 48,
        height: 48,
    },
    xl: {

        width: 56,
        height: 56,
    }
}
const width = typeof size === 'number' ? size : sizes[size].width
const height = typeof size === 'number' ? size : sizes[size].height
</script>
<iconify-icon {icon} {width} {height}/>
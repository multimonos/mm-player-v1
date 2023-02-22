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
</script>
<iconify-icon {icon} width={sizes[size].width} height={sizes[size].height}></iconify-icon>
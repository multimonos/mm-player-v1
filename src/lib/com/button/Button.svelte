<script>
import Icon from "$lib/com/icon/Icon.svelte"


/** set the test id as data-tid */
export let tid = ''

/**
 * set size of button
 * @type { 'default', 'xs', 'sm', 'md', 'lg' }
 */
export let size = 'default'

/** set to `true` to disable the button */
export let disabled = false

/**
 * set to define `color`
 * @type = { 'default', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error', 'ghost' }
 */
export let color = 'default'

/**
 * shape of button
 * @type = { 'default', 'circle', 'square', }
 */
export let shape = 'default'

/**
 * kind of button
 * @type = { 'default', 'link', 'outline' }
 */
export let kind = 'default'

/** add extra classes separated by space */
export let classes = ''

/**
 * set inner content as icon
 */
export let icon = undefined
$: hasIconOnly = icon && ! $$slots.default
$: iconSize = size === 'default' ? 'md' : size

$: props = {
    'data-tid': tid ? tid : undefined,
    disabled: disabled === true ? true : undefined,

    class: [
        'btn',
        size === 'xs' && 'btn-xs',
        size === 'sm' && 'btn-sm',
        size === 'md' && 'btn-md',
        size === 'lg' && 'btn-lg',
        // color
        color === 'primary' && 'btn-primary',
        color === 'secondary' && 'btn-secondary',
        color === 'accent' && 'btn-accent',
        color === 'info' && 'btn-info',
        color === 'success' && 'btn-success',
        color === 'warning' && 'btn-warning',
        color === 'error' && 'btn-error',
        color === 'ghost' && 'btn-ghost',
        // shape
        shape === 'circle' && 'btn-circle',
        shape === 'square' && 'btn-square',
        // kind
        kind === 'link' && 'btn-link',
        kind === 'outline' && 'btn-outline',
        // other
        classes,
    ].filter( Boolean ).join( " " )
}
</script>
<button {...props} type="button" on:click>
    {#if hasIconOnly }
        <Icon {icon} size={iconSize}/>
    {:else}
        <slot/>
    {/if}
</button>
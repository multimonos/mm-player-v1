<script>
import { loremIpsum } from "lorem-ipsum"

// props
export let units = 'paragraph' // paragraph | sentenced | word
export let count = 1
export let format = 'html'

// reactive
$:blocks = new Array( parseInt( count ) )
    .fill()
    .map( x => 'Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Sed posuere consectetur est at lobortis.' )
</script>
{@html loremIpsum( {
    count: parseInt(count),
    units,
    format,
} )}

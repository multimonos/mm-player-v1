<script>
// @see https://sharethis.com/support/customization/how-to-set-custom-buttons/
import { PUBLIC_SHARETHIS_PROPERTY } from "$env/static/public"
import Icon from "$lib/com/icon/Icon.svelte"
import { shareable, shareIsVisible } from "$lib/com/share/sharing.js"


// props
// export let image
let wasCopied = false
let networks = [
    { network: 'email', name: 'email', icon: 'mdi:email' },
    { network: 'gmail', name: 'gmail', icon: 'mdi:google-plus' },
    { network: 'facebook', name: 'facebook', icon: 'mdi:facebook' },
    { network: 'pinterest', name: 'pinterest', icon: 'mdi:pinterest' },
    { network: 'twitter', name: 'twitter', icon: 'mdi:twitter' },
    { network: 'linkedin', name: 'linkedin', icon: 'mdi:linkedin' },
    { network: 'tumblr', name: 'tumblr', icon: 'mdi:tumblr' },
    { network: 'whatsapp', name: 'whatsapp', icon: 'mdi:whatsapp' },
]

// reactives
$: items = networks.map( n => ({
    ...n,
    data: {
        'data-network': n.network,
        'data-url': $shareable.url,
        'data-image': $shareable.image,
        'data-title': $shareable.title,
        'data-description': $shareable.message,
        // 'data-message': $shareable.title,
        'data-email-subject': $shareable.title,
    }
}) )

const copyToClipboard = str => e => {
    console.log( { e } )
    navigator.clipboard.writeText( str )
    wasCopied = true
    setTimeout( () => wasCopied = false, 2500 )
}

</script>

<svelte:head>
    {#if PUBLIC_SHARETHIS_PROPERTY}
        <script type='text/javascript' src='https://platform-api.sharethis.com/js/sharethis.js#property={PUBLIC_SHARETHIS_PROPERTY}&product=sop' async='async'></script>
    {/if}
</svelte:head>

<input type="checkbox" id="sharethis" class="modal-toggle" bind:checked={$shareIsVisible}/>

<label for="sharethis" class="modal modal-bottom sm:modal-middle cursor-pointer">
    <label class="modal-box relative" for="share-modal">

        <label for="sharethis" class="btn btn-circle absolute top-1 right-1">
            <Icon icon="mdi:close" size="sm"/>
        </label>

        <h3 class="mb-8 text-lg font-normal">{$shareable.modalTitle}</h3>

        <div class="form-control">
            <div class="input-group input-group-sm">
                <input type="text" class="input w-full input-bordered cursor-pointer" autocomplete="off" name="url" value={$shareable.url} on:click={copyToClipboard($shareable.url)}/>
                <button type="button" class="btn btn-square btn-primary" class:btn-success={wasCopied} on:click|preventDefault={copyToClipboard($shareable.url)}>
                    {#if wasCopied}
                        <Icon icon="mdi:check-bold" size="sm"/>
                    {:else}
                        <Icon icon="mdi:content-copy" size="sm"/>
                    {/if}
                </button>
            </div>
            <label for="url" class="label label-text-alt pl-4">
                {#if wasCopied}
                    <small class="text-success animate-bounce">Link copied!</small>
                {:else}
                    <small class="">Click to copy link</small>
                {/if}
            </label>
        </div>
        <div class="flex flex-wrap gap-4 my-8">
            {#each items as { data, name, icon }}
                <button type="button" class="btn btn-square btn-secondary btn-outline st-custom-button" {...data}>
                    <Icon {icon} size="md"/>
                </button>
            {/each}
        </div>
    </label>
</label>

<script>
export let msg
export let tid = "error-msg"
</script>
<div
    data-tid={tid}
    class="absolute inset-0 z-50 w-full">

    <div role="alert" class="alert alert-error rounded-none text-sm p-2">
        <span>{msg}</span>
    </div>

</div>

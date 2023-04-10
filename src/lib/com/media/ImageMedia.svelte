<script>
    export let media = null
    $:src = media.url
</script>
<img {src} alt=""/>

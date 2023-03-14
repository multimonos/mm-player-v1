<script>
import Button from "$lib/com/button/Button.svelte"
</script>
<div>
    <div class="px-4 flex flex-col items-center gap-4 bg-gray-600 p-4">

        <div class="flex gap-2">
            <Button tid="foo-button">set Test Id</Button>
            <Button tid="foo-button" disabled={true}>Disabled button</Button>
        </div>

        <div class="flex gap-2 items-center">
            <Button size="xs">xtra small size</Button>
            <Button size="sm">small size</Button>
            <Button size="md">medium size</Button>
            <Button size="lg">large size</Button>
        </div>

        <div class="flex gap-2 items-center">
            <Button color="primary">primary</Button>
            <Button color="secondary">secondary</Button>
            <Button color="ghost">ghost</Button>
        </div>
        <div class="flex gap-2 items-center">
            <Button kind="outline" color="primary">primary</Button>
            <Button kind="outline" color="secondary">secondary</Button>
            <Button kind="outline" color="ghost">ghost</Button>
        </div>

        <div class="flex gap-2 items-center">
            <Button color="info">info</Button>
            <Button color="warning">warning</Button>
            <Button color="error">error</Button>
            <Button color="success">success</Button>
        </div>
        <div class="flex gap-2 items-center">
            <Button kind="outline" color="info">info</Button>
            <Button kind="outline" color="warning">warning</Button>
            <Button kind="outline" color="error">error</Button>
            <Button kind="outline" color="success">success</Button>
        </div>

        <div class="flex gap-2 items-center">
            <Button kind="link">42</Button>
            <Button kind="link"><span class="text-white">42</span></Button>
        </div>

        <div class="flex gap-2 items-center">
            <Button shape="circle">42</Button>
            <Button shape="circle" size="xs">42</Button>
            <Button shape="circle" size="sm">42</Button>
            <Button shape="circle" size="md">42</Button>
            <Button shape="circle" size="lg">42</Button>
            <Button shape="circle" size="lg" kind="outline">42</Button>
            <Button shape="circle" size="lg" disabled={true}>42</Button>
        </div>

        <div class="flex gap-2 items-center">
            <Button shape="square">42</Button>
            <Button shape="square" size="xs">42</Button>
            <Button shape="square" size="sm">42</Button>
            <Button shape="square" size="md">42</Button>
            <Button shape="square" size="lg">42</Button>
            <Button shape="square" size="lg" kind="outline">42</Button>
            <Button shape="square" size="lg" disabled={true}>42</Button>
        </div>

        <div class="flex gap-2 items-center">
            <Button shape="circle" icon="mdi:play"></Button>
            <Button shape="circle" icon="mdi:play" size="xs"></Button>
            <Button shape="circle" icon="mdi:play" size="sm"></Button>
            <Button shape="circle" icon="mdi:play" size="md"></Button>
            <Button shape="circle" icon="mdi:play" size="lg"></Button>
            <Button shape="circle" icon="mdi:play" size="lg" kind="outline"></Button>
            <Button shape="circle" icon="mdi:play" size="lg" disabled={true}></Button>
        </div>

        <div class="flex gap-2 items-center">
            <Button shape="circle" icon="mdi:play" size="md" color="primary"></Button>
            <Button shape="circle" icon="mdi:play" size="md" color="secondary"></Button>
            <Button shape="circle" icon="mdi:play" size="md" color="info"></Button>
            <Button shape="circle" icon="mdi:play" size="md" color="warning"></Button>
            <Button shape="circle" icon="mdi:play" size="md" color="error"></Button>
            <Button shape="circle" icon="mdi:play" size="md" color="success"></Button>
            <Button shape="circle" icon="mdi:play" size="md" color="ghost"></Button>
            <Button shape="circle" icon="mdi:play" size="md" color="ghost" disabled={true}></Button>
        </div>
    </div>
</div>

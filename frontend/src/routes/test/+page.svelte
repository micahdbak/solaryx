<script>
    import { onMount } from "svelte";
    import Component from "$lib/components/Component.svelte";

    let passThrough = $state("1");

    onMount(async () => {
        setTimeout(() => {
            passThrough = "2";
        }, 5000);
    });
</script>

<h1>Database Test</h1>
<Component value={passThrough} />

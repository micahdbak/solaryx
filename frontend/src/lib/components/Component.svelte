<script>
    import { onMount } from "svelte";

    export let value;

    let result = "Loading...";

    onMount(async () => {
        try {
            const res = await fetch("/api/test");
            if (res.ok) {
                result = await res.text();
            } else {
                result = `Error: ${res.statusText}`;
            }
        } catch (err) {
            result = `Error: ${err.message}`;
        }
    });
</script>

<p>{result} {value}</p>

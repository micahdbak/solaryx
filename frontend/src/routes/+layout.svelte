<script>
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import { isHydeStore } from "$lib/theme";
	import Header from "$lib/components/Header.svelte";

	let { children, data } = $props();

	// Effect to observe store changes and apply to body
	$effect(() => {
		if (typeof document !== "undefined") {
			document.body.classList.toggle("hyde-mode", $isHydeStore);
			document.body.style.backgroundColor = $isHydeStore ? "#1a0000" : "#0b0f19";
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Header {data} />
<main class="min-h-screen">
	{@render children()}
</main>

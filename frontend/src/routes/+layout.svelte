<script>
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import { isHydeStore } from "$lib/theme";
	import Header from "$lib/components/Header.svelte";

	let { children, data } = $props();

	let burstType = $state(null); // 'hyde' | 'normal' | null
	let _prevHyde = false;

	// Effect to observe store changes and apply to body
	$effect(() => {
		if (typeof document !== "undefined") {
			const isHydeNow = $isHydeStore;
			document.body.classList.toggle("hyde-mode", isHydeNow);

			if (isHydeNow !== _prevHyde) {
				// Transitioning from normal -> hyde
				if (isHydeNow) {
					burstType = "hyde";
					setTimeout(() => {
						burstType = null;
					}, 1250);
				}
				// Transitioning from hyde -> normal
				else {
					burstType = "normal";
					setTimeout(() => {
						burstType = null;
					}, 1550);
				}
			}

			_prevHyde = isHydeNow;
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<!-- Burst Overlay -->
{#if burstType === "hyde"}
	<div class="hyde-burst-overlay pointer-events-none"></div>
{:else if burstType === "normal"}
	<div class="normal-burst-overlay pointer-events-none"></div>
{/if}

<Header {data} />
<main class="min-h-screen">
	{@render children()}
</main>

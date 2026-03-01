<script>
	import { onMount, onDestroy } from "svelte";
	import { isHydeStore, searchQueryStore, activeTopicStore } from "$lib/theme";
	import { fetchMarkets, fetchCharities, formatMarket, indexCharities } from "$lib/api";
	import MarketCard from "$lib/components/MarketCard.svelte";

	let markets = $state([]);
	let loading = $state(true);
	let tickInterval;

	function computeLiveTime(endsAt) {
		const remaining = endsAt - Date.now();
		if (remaining <= 0) return "Ended";
		const h = Math.floor(remaining / 3600000);
		const m = Math.floor((remaining % 3600000) / 60000);
		const s = Math.floor((remaining % 60000) / 1000);
		if (h > 0) return `${h}h ${m}m ${s}s`;
		if (m > 0) return `${m}m ${s}s`;
		return `${s}s`;
	}

	onMount(async () => {
		try {
			const [rawMarkets, rawCharities] = await Promise.all([
				fetchMarkets(),
				fetchCharities()
			]);
			const lookup = indexCharities(rawCharities);
			markets = rawMarkets.map((m) => formatMarket(m, lookup));
		} catch (e) {
			console.error("Failed to load markets:", e);
		} finally {
			loading = false;
		}

		tickInterval = setInterval(() => {
			markets = markets.map((m) => ({
				...m,
				timeRemaining: computeLiveTime(m.endsAt)
			}));
		}, 1000);
	});

	onDestroy(() => {
		if (tickInterval) clearInterval(tickInterval);
	});

	let displayBets = $derived(
		markets
			.filter((b) => {
				if (b.isHyde !== $isHydeStore) return false;

				if ($searchQueryStore) {
					const query = $searchQueryStore.toLowerCase();
					const matchesTitle = b.title.toLowerCase().includes(query);
					if (!matchesTitle) return false;
				}

				if (b.endsAt < Date.now()) return false;

				if ($activeTopicStore === "Expiring Soon") {
					// already filtered out ended ones above
				}

				return true;
			})
			.sort((a, b) => {
				if ($activeTopicStore === "Trending" || $activeTopicStore === "Breaking") {
					return b.totalSol - a.totalSol;
				}
				if ($activeTopicStore === "New") {
					return b.createdAt - a.createdAt;
				}
				if ($activeTopicStore === "Expiring Soon") {
					return a.endsAt - b.endsAt;
				}
				return 0;
			})
	);
</script>

<div class="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
	<div></div>

	{#if loading}
		<div class="flex items-center justify-center py-20">
			<p class="text-gray-400 text-sm">Loading markets...</p>
		</div>
	{:else if displayBets.length === 0}
		<div class="flex items-center justify-center py-20">
			<p class="text-gray-500 text-sm">No markets found.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{#each displayBets as cause}
				<MarketCard {cause} />
			{/each}
		</div>
	{/if}
</div>

<script>
	import { onMount, onDestroy } from "svelte";
	import { isHydeStore, searchQueryStore, activeTopicStore } from "$lib/theme";
	import { fetchMarkets, fetchCharities, formatMarket, indexCharities } from "$lib/api";
	import { formatTimeRemaining, filterAndSortMarkets } from "$lib/utils";
	import MarketCard from "$lib/components/MarketCard.svelte";
	import TrendingHeader from "$lib/components/TrendingHeader.svelte";

	let markets = $state([]);
	let loading = $state(true);
	let tickInterval;

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
				timeRemaining: formatTimeRemaining(m.endsAt)
			}));
		}, 1000);
	});

	onDestroy(() => {
		if (tickInterval) clearInterval(tickInterval);
	});

	let displayBets = $derived(
		filterAndSortMarkets(markets, {
			isHyde: $isHydeStore,
			searchQuery: $searchQueryStore,
			activeTopic: $activeTopicStore,
			excludeEnded: true
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
		<!-- Trending Markets Header -->
		<TrendingHeader markets={displayBets} />

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{#each displayBets as cause}
				<MarketCard {cause} />
			{/each}
		</div>
	{/if}
</div>

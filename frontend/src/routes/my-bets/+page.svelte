<script>
	import { onMount } from "svelte";
	import { isHydeStore, searchQueryStore, activeTopicStore } from "$lib/theme";
	import { fetchMyBets, fetchCharities, formatMarket, indexCharities } from "$lib/api";
	import MarketCard from "$lib/components/MarketCard.svelte";

	let markets = $state([]);
	let loading = $state(true);
	let errorMsg = $state(null);

	onMount(async () => {
		try {
			const [rawMarkets, rawCharities] = await Promise.all([fetchMyBets(), fetchCharities()]);
			const lookup = indexCharities(rawCharities);
			markets = rawMarkets.map((m) => formatMarket(m, lookup));
		} catch (e) {
			console.error("Failed to load my bets:", e);
			errorMsg = "Please log in to view your bets.";
		} finally {
			loading = false;
		}
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
				return b.createdAt - a.createdAt;
			})
	);
</script>

<div class="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-white">My Bets</h1>
		<p class="text-gray-400 text-sm mt-1">Markets you have participated in.</p>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-20">
			<p class="text-gray-400 text-sm">Loading your bets...</p>
		</div>
	{:else if errorMsg}
		<div class="flex flex-col items-center justify-center py-20">
			<p class="text-red-400 text-sm mb-4">{errorMsg}</p>
			<a
				href="/login"
				class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
				>Log In</a
			>
		</div>
	{:else if displayBets.length === 0}
		<div class="flex items-center justify-center py-20">
			<p class="text-gray-500 text-sm">You haven't placed any bets here yet.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{#each displayBets as cause}
				<MarketCard {cause} buttonLabel="View Market" />
			{/each}
		</div>
	{/if}
</div>

<script>
	import { onMount, onDestroy } from "svelte";
	import { isHydeStore, searchQueryStore, activeTopicStore } from "$lib/theme";
	import { fetchMarkets, fetchCharities, formatMarket, indexCharities } from "$lib/api";

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
				<a
					href="/bet/{cause.id}"
					class="bg-[#11141c] hover:bg-[#1a1e28] border border-gray-700/50 hover:border-gray-600/50 transition-all rounded-xl p-4 flex flex-col group block no-underline shadow-lg {$isHydeStore
						? 'border-red-900/50 hover:border-red-800/80 bg-red-950/20 hover:bg-red-950/40'
						: ''}"
				>
					<!-- Title & Header -->
					<div class="flex justify-between items-start mb-5 h-[50px]">
						<div class="flex gap-3">
							<img
								src={cause.image}
								alt="icon"
								class="w-7 h-7 rounded-full mt-0.5 bg-black/20"
							/>
							<h3
								class="text-[0.90rem] font-semibold text-gray-200 leading-tight group-hover:text-white transition-colors line-clamp-3"
							>
								{cause.title}
							</h3>
						</div>
					</div>

					<div class="flex-1 flex flex-col justify-end">
						<!-- Option Rows (Progress Bars) -->
						<div class="flex flex-col gap-2 mb-4">
							<div
								class="relative overflow-hidden rounded bg-black/40 h-8 flex items-center border border-gray-800/50 {$isHydeStore
									? 'border-red-950/50'
									: ''}"
							>
								<div
									class="absolute inset-y-0 left-0 var-bg-optionA-medium"
									style="width: {cause.chance}%;"
								></div>
								<div class="relative w-full flex justify-between items-center px-3">
									<span
										class="text-sm font-bold var-color-optionA z-10 truncate max-w-[70%]"
										>{cause.optionA.name}</span
									>
									<span class="text-white text-sm font-black z-10"
										>{cause.chance}%</span
									>
								</div>
							</div>
							<div
								class="relative overflow-hidden rounded bg-black/40 h-8 flex items-center border border-gray-800/50 {$isHydeStore
									? 'border-red-950/50'
									: ''}"
							>
								<div
									class="absolute inset-y-0 left-0 var-bg-optionB-medium"
									style="width: {cause.totalSol === 0 ? 0 : 100 - cause.chance}%;"
								></div>
								<div class="relative w-full flex justify-between items-center px-3">
									<span
										class="text-sm font-bold var-color-optionB z-10 truncate max-w-[70%]"
										>{cause.optionB.name}</span
									>
									<span class="text-white text-sm font-black z-10"
										>{cause.totalSol === 0 ? 0 : 100 - cause.chance}%</span
									>
								</div>
							</div>
						</div>

						<!-- Single Button -->
						<div class="mb-3">
							<div
								class="w-full py-2.5 rounded font-bold text-sm transition-colors text-center text-white/90 bg-white/10 group-hover:bg-white/20 {$isHydeStore
									? 'group-hover:bg-red-500/30 text-red-100'
									: 'group-hover:bg-blue-500/30'}"
							>
								Donate to Vote
							</div>
						</div>
					</div>

					<!-- Footer -->
					<div
						class="flex items-center justify-between text-[0.65rem] text-gray-400 border-t border-gray-700/50 pt-2.5 mt-1 font-semibold"
					>
						<div class="flex gap-2 items-center flex-wrap">
							<span class="text-gray-500 flex items-center gap-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									class="var-color-optionA"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><circle cx="12" cy="12" r="10"></circle><polyline
										points="12 6 12 12 16 14"
									></polyline></svg
								>
								{cause.timeRemaining}
							</span>
						</div>
						<div class="flex gap-3">
							<span class="text-gray-500 text-[0.6rem]">{cause.vol}</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

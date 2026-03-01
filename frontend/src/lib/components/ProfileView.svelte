<script>
	import { onMount } from "svelte";
	import { isHydeStore } from "$lib/theme";
	import { formatSol } from "$lib/utils";
	import { fetchMarkets, fetchCharities, formatMarket, indexCharities } from "$lib/api";
	import MarketCard from "$lib/components/MarketCard.svelte";

	let { userId } = $props();

	let profile = $state(null);
	let shares = $state([]);
	let markets = $state([]);
	let loading = $state(true);
	let activeTab = $state("ACTIVE");
	let timeFilter = $state("ALL");

	onMount(async () => {
		try {
			const [profRes, rawMarkets, rawCharities] = await Promise.all([
				fetch(`/api/profile/${userId}`),
				fetchMarkets(),
				fetchCharities()
			]);

			if (profRes.ok) {
				const profData = await profRes.json();
				profile = profData;
				shares = profData.shares || [];
			}

			const lookup = indexCharities(rawCharities);
			markets = rawMarkets.map((m) => formatMarket(m, lookup));
		} catch (e) {
			console.error("Failed to load profile context:", e);
		} finally {
			loading = false;
		}
	});

	let timeFilteredShares = $derived(
		shares.filter((s) => {
			if (timeFilter === "ALL") return true;
			const shareTime = new Date(s.created_at).getTime();
			const now = Date.now();
			if (timeFilter === "1D") return now - shareTime <= 86400000;
			if (timeFilter === "1W") return now - shareTime <= 604800000;
			return true;
		})
	);

	let totalDonation = $derived(
		timeFilteredShares.reduce((sum, s) => sum + Number(s.amount_sol), 0)
	);
	let topDonation = $derived(
		timeFilteredShares.length > 0
			? Math.max(...timeFilteredShares.map((s) => Number(s.amount_sol)))
			: 0
	);

	let displayMarkets = $derived.by(() => {
		const marketIds = [...new Set(timeFilteredShares.map((s) => s.market_id))];
		const userMarkets = markets.filter((m) => marketIds.includes(m.id));

		return userMarkets.filter((m) => {
			if (activeTab === "ACTIVE") return m.status === "ACTIVE";
			if (activeTab === "CLOSED") {
				if (m.status !== "COMPLETE") return false;
				const marketShares = timeFilteredShares.filter((s) => s.market_id === m.id);
				const hasUnseen = marketShares.some((s) => s.seen_result === false);
				return hasUnseen;
			}
			return true;
		});
	});

	let graphData = $derived.by(() => {
		let chartShares = [...timeFilteredShares].sort(
			(a, b) => new Date(a.created_at) - new Date(b.created_at)
		);

		if (chartShares.length === 0) {
			return { path: "M0,90 L400,90", area: "M0,90 L400,90 L400,100 L0,100 Z" };
		}
		if (chartShares.length === 1) {
			return { path: "M0,50 L400,50", area: "M0,50 L400,50 L400,100 L0,100 Z" };
		}

		let runningTotal = 0;
		const points = chartShares.map((s) => {
			runningTotal += Number(s.amount_sol);
			return { time: new Date(s.created_at).getTime(), value: runningTotal };
		});

		const minTime = points[0].time;
		const maxTime = points[points.length - 1].time;
		const timeRange = maxTime - minTime || 1;
		const maxValue = points[points.length - 1].value;

		const SVG_WIDTH = 400;
		const SVG_HEIGHT = 100;
		const Y_PADDING = 10;
		const Y_USABLE = SVG_HEIGHT - Y_PADDING * 2;

		let pathD = "";
		let areaD = "";

		points.forEach((pt, i) => {
			const x = ((pt.time - minTime) / timeRange) * SVG_WIDTH;
			const y = SVG_HEIGHT - Y_PADDING - (pt.value / maxValue) * Y_USABLE;

			if (i === 0) {
				pathD += `M${x.toFixed(1)},${y.toFixed(1)} `;
				areaD += `M${x.toFixed(1)},${y.toFixed(1)} `;
			} else {
				pathD += `L${x.toFixed(1)},${y.toFixed(1)} `;
				areaD += `L${x.toFixed(1)},${y.toFixed(1)} `;
			}
		});

		areaD += `L${SVG_WIDTH},100 L0,100 Z`;
		return { path: pathD, area: areaD };
	});
</script>

<div class="max-w-[1240px] mx-auto p-4 md:p-6 lg:p-8 pt-8 font-sans">
	{#if loading}
		<div class="flex items-center justify-center py-20">
			<p class="text-[var(--text-muted)] text-sm">Loading profile...</p>
		</div>
	{:else if profile}
		<!-- Stats Boxes -->
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 mb-10">
			<!-- Left Box: User Info & Core Stats -->
			<div
				class="reactive-hover bg-[var(--bg-card)] rounded-2xl p-6 shadow-lg border border-[var(--border-card)]"
			>
				<div class="flex justify-between items-start mb-10">
					<div class="flex items-center gap-4">
						{#if profile.avatar_url}
							<img
								src={profile.avatar_url}
								alt="User Avatar"
								class="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] object-cover"
							/>
						{:else}
							<div
								class="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]"
							></div>
						{/if}
						<div>
							<h1
								class="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2"
							>
								{profile.username}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
									><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path
										d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
									/></svg
								>
							</h1>
							<p class="text-[0.8rem] text-[var(--text-muted)] mt-1 font-medium">
								Joined {new Date().toLocaleDateString("en-US", {
									month: "short",
									year: "numeric"
								})}
							</p>
						</div>
					</div>
					<div
						class="p-2 hover:bg-[var(--text-primary)]/5 rounded-lg cursor-pointer transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline
								points="16 6 12 2 8 6"
							/><line x1="12" x2="12" y1="2" y2="15" /></svg
						>
					</div>
				</div>

				<div class="flex items-center gap-8 border-t border-[var(--border-card)] pt-5">
					<div>
						<div class="text-[1.1rem] font-bold text-[var(--text-primary)]">
							{formatSol(totalDonation)} SOL
						</div>
						<div class="text-[0.75rem] text-[var(--text-muted)] font-semibold mt-0.5">
							Total Donation
						</div>
					</div>
					<div class="w-px h-8 bg-[var(--border-card)]"></div>
					<div>
						<div class="text-[1.1rem] font-bold text-[var(--text-primary)]">
							{formatSol(topDonation)} SOL
						</div>
						<div class="text-[0.75rem] text-[var(--text-muted)] font-semibold mt-0.5">
							Top Donation
						</div>
					</div>
					<div class="w-px h-8 bg-[var(--border-card)]"></div>
					<div>
						<div class="text-[1.1rem] font-bold text-[var(--text-primary)]">
							{shares.length}
						</div>
						<div class="text-[0.75rem] text-[var(--text-muted)] font-semibold mt-0.5">
							Total Shares
						</div>
					</div>
				</div>
			</div>

			<!-- Right Box: Chart & Total Value -->
			<div
				class="reactive-hover bg-[var(--bg-card)] rounded-2xl p-6 shadow-lg border border-[var(--border-card)] flex flex-col min-h-[220px] relative"
			>
				<div class="flex justify-between items-start mb-2 z-10 w-full">
					<div>
						<div
							class="text-[0.7rem] text-[#9ece6a] font-bold flex items-center gap-1 uppercase tracking-wider mb-1"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="10"
								height="10"
								viewBox="0 0 24 24"
								fill="currentColor"
								stroke="none"><polygon points="12 4 4 20 20 20" /></svg
							>
							Total Donated
						</div>
						<div
							class="text-[2rem] font-bold text-[var(--text-primary)] tracking-tight leading-none mb-1"
						>
							{formatSol(totalDonation)} SOL
						</div>
						<div class="text-[0.75rem] text-[var(--text-muted)] font-medium">
							Over All Time
						</div>
					</div>

					<div
						class="flex items-center gap-1 text-[0.75rem] font-bold text-[var(--text-muted)] bg-black/20 p-1 rounded-md"
					>
						<button
							onclick={() => (timeFilter = "1D")}
							class="px-2.5 py-1 rounded transition-colors {timeFilter === '1D'
								? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
								: 'hover:text-[var(--text-primary)]'}">1D</button
						>
						<button
							onclick={() => (timeFilter = "1W")}
							class="px-2.5 py-1 rounded transition-colors {timeFilter === '1W'
								? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
								: 'hover:text-[var(--text-primary)]'}">1W</button
						>
						<button
							onclick={() => (timeFilter = "ALL")}
							class="px-2.5 py-1 rounded transition-colors {timeFilter === 'ALL'
								? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
								: 'hover:text-[var(--text-primary)]'}">ALL</button
						>
					</div>
				</div>

				<!-- Track Graph -->
				<div
					class="absolute inset-0 w-full h-full flex items-end opacity-80 pt-16 pointer-events-none rounded-[1rem] overflow-hidden"
				>
					<svg
						viewBox="0 0 400 100"
						class="w-full h-[70%] preserve-3d"
						preserveAspectRatio="none"
					>
						<defs>
							<linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stop-color="var(--color-primary)"
									stop-opacity="0.25"
								></stop>
								<stop
									offset="100%"
									stop-color="var(--color-primary)"
									stop-opacity="0.0"
								></stop>
							</linearGradient>
							<style>
								.chart-path {
									stroke: var(--color-primary);
								}
							</style>
						</defs>
						<path d={graphData.area} fill="url(#chartGrad)" />
						<path
							d={graphData.path}
							fill="none"
							class="chart-path"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
			</div>
		</div>

		<!-- List Header & Tabs -->
		<div class="mb-6">
			<div class="flex items-center justify-between">
				<div
					class="flex items-center bg-[var(--bg-card)] p-1 rounded-lg border border-[var(--border-card)]"
				>
					<button
						class="px-5 py-1.5 rounded-md text-[0.85rem] font-bold transition-all {activeTab ===
						'ACTIVE'
							? 'bg-[var(--bg-muted)] text-[var(--text-primary)] shadow-sm'
							: 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}"
						onclick={() => (activeTab = "ACTIVE")}
					>
						Active
					</button>
					<button
						class="px-5 py-1.5 rounded-md text-[0.85rem] font-bold transition-all {activeTab ===
						'CLOSED'
							? 'bg-[var(--bg-muted)] text-[var(--text-primary)] shadow-sm'
							: 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}"
						onclick={() => (activeTab = "CLOSED")}
					>
						Closed
					</button>
				</div>
			</div>
		</div>

		<!-- Market Cards Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{#each displayMarkets as cause}
				<MarketCard {cause} showCompleteOverlay={activeTab === "CLOSED"} />
			{/each}

			{#if displayMarkets.length === 0}
				<div
					class="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-16 bg-[var(--bg-card)]/50 rounded-lg border border-dashed border-[var(--border-card)]"
				>
					<p class="text-[var(--text-muted)] font-medium">
						No {activeTab.toLowerCase()} markets found.
					</p>
				</div>
			{/if}
		</div>
	{:else}
		<div class="text-center py-20 text-[var(--color-primary)] font-bold">
			Failed to load profile.
		</div>
	{/if}
</div>

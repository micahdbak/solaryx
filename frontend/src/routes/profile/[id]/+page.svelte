<script>
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { isHydeStore } from "$lib/theme";
	import { fetchMarkets, fetchCharities, formatMarket, indexCharities } from "$lib/api";

	let profile = $state(null);
	let shares = $state([]);
	let markets = $state([]);
	let loading = $state(true);
	let activeTab = $state("ACTIVE");
	let timeFilter = $state("ALL"); // '1D', '1W', 'ALL'

	onMount(async () => {
		try {
			// Fetch profile data and other necessary data in parallel
			const [profRes, rawMarkets, rawCharities] = await Promise.all([
				fetch(`/api/profile/${$page.params.id}`),
				fetchMarkets(),
				fetchCharities()
			]);

			if (profRes.ok) {
				const profData = await profRes.json();
				profile = profData;
				shares = profData.shares || [];
			}

			// Format markets for display
			const lookup = indexCharities(rawCharities);
			markets = rawMarkets.map((m) => formatMarket(m, lookup));
		} catch (e) {
			console.error("Failed to load profile context:", e);
		} finally {
			loading = false;
		}
	});

	// 1. Filter shares by Time
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

	// 2. Base metrics specifically bound to the time filter
	let totalDonation = $derived(
		timeFilteredShares.reduce((sum, s) => sum + Number(s.amount_sol), 0)
	);
	let topDonation = $derived(
		timeFilteredShares.length > 0
			? Math.max(...timeFilteredShares.map((s) => Number(s.amount_sol)))
			: 0
	);

	// 3. Tab filter for the list below the chart (Active/Closed)
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

	// 4. Generate SVG Path Data for Chart
	let graphData = $derived.by(() => {
		// Only chart FINALIZED (actual past donations over time) to look realistic, or all if preferred.
		// For aesthetics, let's chart all filtered shares but sort them chronologically
		let chartShares = [...timeFilteredShares].sort(
			(a, b) => new Date(a.created_at) - new Date(b.created_at)
		);

		if (chartShares.length === 0) {
			// Flat line at zero
			return {
				path: "M0,90 L400,90",
				area: "M0,90 L400,90 L400,100 L0,100 Z"
			};
		}
		if (chartShares.length === 1) {
			// Flat line at their one donation
			return {
				path: "M0,50 L400,50",
				area: "M0,50 L400,50 L400,100 L0,100 Z"
			};
		}

		let runningTotal = 0;
		const points = chartShares.map((s) => {
			runningTotal += Number(s.amount_sol);
			return {
				time: new Date(s.created_at).getTime(),
				value: runningTotal
			};
		});

		const minTime = points[0].time;
		const maxTime = points[points.length - 1].time;
		const timeRange = maxTime - minTime || 1; // avoid division by zero
		const maxValue = points[points.length - 1].value;
		const minValue = 0;
		const valueRange = maxValue - minValue || 1;

		// SVG ViewBox is 400x100
		// Y goes from 10 (top) to 90 (bottom) to give some padding
		const SVG_WIDTH = 400;
		const SVG_HEIGHT = 100;
		const Y_PADDING = 10;
		const Y_USABLE = SVG_HEIGHT - Y_PADDING * 2;

		let pathD = "";
		let areaD = "";

		points.forEach((pt, i) => {
			// X coordinate mapping (0 to 400)
			const x = ((pt.time - minTime) / timeRange) * SVG_WIDTH;
			// Y coordinate mapping (inverted, so higher value = lower Y pixel)
			// Map value [0, maxValue] to [90, 10]
			const y = SVG_HEIGHT - Y_PADDING - (pt.value / maxValue) * Y_USABLE;

			if (i === 0) {
				pathD += `M${x.toFixed(1)},${y.toFixed(1)} `;
				areaD += `M${x.toFixed(1)},${y.toFixed(1)} `;
			} else {
				pathD += `L${x.toFixed(1)},${y.toFixed(1)} `;
				areaD += `L${x.toFixed(1)},${y.toFixed(1)} `;
			}
		});

		// Close the area path down to the bottom of the SVG
		const lastX = SVG_WIDTH;
		areaD += `L${lastX},100 L0,100 Z`;

		return { path: pathD, area: areaD };
	});
</script>

<div class="max-w-[1240px] mx-auto p-4 md:p-6 lg:p-8 pt-8 font-sans">
	{#if loading}
		<div class="flex items-center justify-center py-20">
			<p class="text-gray-400 text-sm">Loading profile...</p>
		</div>
	{:else if profile}
		<!-- Stats Boxes -->
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 mb-10">
			<!-- Left Box: User Info & Core Stats -->
			<div
				class="bg-[#1e212b] rounded-[1rem] p-6 shadow-lg border border-gray-800/60 {$isHydeStore
					? 'bg-red-950/20 border-red-900/40'
					: ''}"
			>
				<div class="flex justify-between items-start mb-10">
					<div class="flex items-center gap-4">
						{#if profile.avatar_url}
							<img
								src={profile.avatar_url}
								alt="User Avatar"
								class="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-blue-500 to-purple-600 object-cover"
							/>
						{:else}
							<div
								class="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
							></div>
						{/if}
						<div>
							<h1 class="text-xl font-bold text-gray-100 flex items-center gap-2">
								{profile.username}
								<!-- Copy Icon Mock -->
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
									class="text-gray-500 hover:text-white cursor-pointer transition-colors"
									><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path
										d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
									/></svg
								>
							</h1>
							<p class="text-[0.8rem] text-gray-400 mt-1 font-medium">
								Joined {new Date().toLocaleDateString("en-US", {
									month: "short",
									year: "numeric"
								})}
							</p>
						</div>
					</div>
					<!-- Share Icon Mock -->
					<div
						class="p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors text-gray-400 hover:text-white"
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

				<div
					class="flex items-center gap-8 border-t border-gray-800/60 pt-5 {$isHydeStore
						? 'border-red-900/40'
						: ''}"
				>
					<div>
						<div class="text-[1.1rem] font-bold text-gray-200">
							{totalDonation.toFixed(2)} SOL
						</div>
						<div class="text-[0.75rem] text-gray-500 font-semibold mt-0.5">
							Total Donation
						</div>
					</div>
					<div
						class="w-px h-8 bg-gray-800/80 {$isHydeStore ? 'bg-red-900/50' : ''}"
					></div>
					<div>
						<div class="text-[1.1rem] font-bold text-gray-200">
							{topDonation.toFixed(2)} SOL
						</div>
						<div class="text-[0.75rem] text-gray-500 font-semibold mt-0.5">
							Top Donation
						</div>
					</div>
					<div
						class="w-px h-8 bg-gray-800/80 {$isHydeStore ? 'bg-red-900/50' : ''}"
					></div>
					<div>
						<div class="text-[1.1rem] font-bold text-gray-200">
							{shares.length}
						</div>
						<div class="text-[0.75rem] text-gray-500 font-semibold mt-0.5">
							Total Shares
						</div>
					</div>
				</div>
			</div>

			<!-- Right Box: Chart & Total Value -->
			<div
				class="bg-[#1e212b] rounded-[1rem] p-6 shadow-lg border border-gray-800/60 flex flex-col min-h-[220px] relative {$isHydeStore
					? 'bg-red-950/20 border-red-900/40'
					: ''}"
			>
				<div class="flex justify-between items-start mb-2 z-10 w-full">
					<div>
						<div
							class="text-[0.7rem] text-green-400 font-bold flex items-center gap-1 uppercase tracking-wider mb-1"
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
							class="text-[2rem] font-bold text-white tracking-tight leading-none mb-1"
						>
							{totalDonation.toFixed(2)} SOL
						</div>
						<div class="text-[0.75rem] text-gray-500 font-medium">Over All Time</div>
					</div>

					<div
						class="flex items-center gap-1 text-[0.75rem] font-bold text-gray-400 bg-black/20 p-1 rounded-md"
					>
						<button
							onclick={() => (timeFilter = "1D")}
							class="px-2.5 py-1 rounded transition-colors {timeFilter === '1D'
								? $isHydeStore
									? 'bg-red-500/20 text-red-400'
									: 'bg-blue-500/20 text-blue-400'
								: 'hover:text-white'}">1D</button
						>
						<button
							onclick={() => (timeFilter = "1W")}
							class="px-2.5 py-1 rounded transition-colors {timeFilter === '1W'
								? $isHydeStore
									? 'bg-red-500/20 text-red-400'
									: 'bg-blue-500/20 text-blue-400'
								: 'hover:text-white'}">1W</button
						>
						<button
							onclick={() => (timeFilter = "ALL")}
							class="px-2.5 py-1 rounded transition-colors {timeFilter === 'ALL'
								? $isHydeStore
									? 'bg-red-500/20 text-red-400'
									: 'bg-blue-500/20 text-blue-400'
								: 'hover:text-white'}">ALL</button
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
									stop-color="var(--chart-color, #3b82f6)"
									stop-opacity="0.3"
								></stop>
								<stop
									offset="100%"
									stop-color="var(--chart-color, #3b82f6)"
									stop-opacity="0.0"
								></stop>
							</linearGradient>
							<style>
								.chart-path {
									stroke: #6366f1;
								}
								:global(.hyde-mode) .chart-path {
									stroke: #ef4444;
								}
								:global(.hyde-mode) stop {
									stop-color: #ef4444;
								}
							</style>
						</defs>
						<!-- Area -->
						<path d={graphData.area} fill="url(#chartGrad)" />
						<!-- Line -->
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
					class="flex items-center bg-[#1e212b] p-1 rounded-lg border border-gray-800/60 {$isHydeStore
						? 'bg-red-950/20 border-red-900/40'
						: ''}"
				>
					<button
						class="px-5 py-1.5 rounded-md text-[0.85rem] font-bold transition-all {activeTab ===
						'ACTIVE'
							? 'bg-[#2a2d36] text-white shadow-sm'
							: 'text-gray-400 hover:text-gray-200'}"
						onclick={() => (activeTab = "ACTIVE")}
					>
						Active
					</button>
					<button
						class="px-5 py-1.5 rounded-md text-[0.85rem] font-bold transition-all {activeTab ===
						'CLOSED'
							? 'bg-[#2a2d36] text-white shadow-sm'
							: 'text-gray-400 hover:text-gray-200'}"
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
				<div class="relative group">
					<!-- COMPLETE Overlay for Closed Markets -->
					{#if activeTab === "CLOSED"}
						<a
							href="/bet/{cause.id}"
							class="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-xl border-2 border-gray-500/50 hover:bg-black/30 transition-all cursor-pointer no-underline"
						>
							<div
								class="bg-gray-700 text-gray-200 font-black text-xl px-6 py-2 rounded-lg shadow-[0_0_20px_rgba(156,163,175,0.4)] transform hover:scale-105 transition-transform tracking-widest"
							>
								COMPLETE
							</div>
						</a>
					{/if}

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
									<div
										class="relative w-full flex justify-between items-center px-3"
									>
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
										style="width: {cause.totalSol === 0
											? 0
											: 100 - cause.chance}%;"
									></div>
									<div
										class="relative w-full flex justify-between items-center px-3"
									>
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
				</div>
			{/each}

			{#if displayMarkets.length === 0}
				<div
					class="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-16 bg-[#1e212b]/50 rounded-lg border border-dashed border-gray-800 {$isHydeStore
						? 'border-red-950/50'
						: ''}"
				>
					<p class="text-gray-500 font-medium">
						No {activeTab.toLowerCase()} markets found.
					</p>
				</div>
			{/if}
		</div>
	{:else}
		<div class="text-center py-20 text-red-500 font-bold">Failed to load profile.</div>
	{/if}
</div>

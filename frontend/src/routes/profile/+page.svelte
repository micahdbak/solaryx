<script>
	import { onMount } from "svelte";
	import { isHydeStore } from "$lib/theme";
	import { fetchMarkets, fetchCharities, formatMarket, indexCharities } from "$lib/api";

	let profile = $state(null);
	let shares = $state([]);
	let markets = $state([]);
	let loading = $state(true);
	let activeTab = $state("ACTIVE");

	onMount(async () => {
		try {
			// Get current user auth status
			const authRes = await fetch("/api/auth/status");
			const authData = await authRes.json();

			if (!authData.status) {
				window.location.href = "/login";
				return;
			}

			// Fetch profile data and other necessary data in parallel
			const [profRes, rawMarkets, rawCharities] = await Promise.all([
				fetch(`/api/profile/${authData.user.id}`),
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

	let totalDonation = $derived(shares.reduce((sum, s) => sum + Number(s.amount_sol), 0));
	let topDonation = $derived(
		shares.length > 0 ? Math.max(...shares.map((s) => Number(s.amount_sol))) : 0
	);

	let displayShares = $derived(
		shares.filter((s) => {
			if (activeTab === "ACTIVE") return s.transaction_status === "WAITING";
			if (activeTab === "CLOSED") return s.transaction_status === "FINALIZED";
			return true;
		})
	);
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
						<div class="text-[1.1rem] font-bold text-gray-200">{shares.length}</div>
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
						<button class="px-2.5 py-1 rounded hover:text-white transition-colors"
							>1D</button
						>
						<button class="px-2.5 py-1 rounded hover:text-white transition-colors"
							>1W</button
						>
						<button
							class="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 {$isHydeStore
								? 'bg-red-500/20 text-red-400'
								: ''}">ALL</button
						>
					</div>
				</div>

				<!-- Mockup Graph -->
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
						<path
							d="M0,80 Q50,75 100,78 T200,60 T300,65 T350,50 T400,10 L400,100 L0,100 Z"
							fill="url(#chartGrad)"
						/>
						<!-- Line -->
						<path
							d="M0,80 Q50,75 100,78 T200,60 T300,65 T350,50 T400,10"
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

		<!-- Table Headers -->
		<div
			class="grid grid-cols-[3fr_1fr_1fr_1fr] md:grid-cols-[4fr_1fr_1fr_1fr_40px] px-4 py-2 text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider mb-2"
		>
			<div>Market</div>
			<div class="text-right">Selected</div>
			<div class="text-right">Amount</div>
			<div class="text-right">Status</div>
			<div class="hidden md:block"></div>
		</div>

		<!-- Transactions/Shares List -->
		<div class="flex flex-col gap-2">
			{#each displayShares as share}
				{@const market = markets.find((m) => m.id === share.market_id)}
				<a
					href={market ? `/bet/${market.id}` : "#"}
					class="bg-[#1e212b] rounded-lg p-4 flex items-center border border-gray-800/50 hover:bg-[#252833] hover:border-gray-700 transition-all cursor-pointer group no-underline {$isHydeStore
						? 'bg-red-950/10 border-red-950/50 hover:bg-red-950/20'
						: ''}"
				>
					<!-- Column 1: Market Info -->
					<div class="w-[30%] flex-1 flex items-center gap-4">
						{#if market}
							<img
								src={market.image}
								alt=""
								class="w-10 h-10 rounded-full object-cover bg-black/20 shrink-0 border border-gray-700/50"
							/>
							<div
								class="text-[0.9rem] font-bold text-gray-200 group-hover:text-white transition-colors line-clamp-2 md:pr-4"
							>
								{market.title}
							</div>
						{:else}
							<div class="w-10 h-10 rounded-full bg-gray-800 shrink-0"></div>
							<div class="text-[0.95rem] font-bold text-gray-400">
								Loading market...
							</div>
						{/if}
					</div>

					<!-- Column 2: Selected Option (Simplified mockup for now because mapping share->charity name is complex) -->
					<div class="w-[15%] text-right font-bold text-[0.85rem]">
						<span class="text-gray-300">Donation</span>
					</div>

					<!-- Column 3: Amount -->
					<div class="w-[15%] text-right">
						<div class="font-bold text-white text-[0.95rem]">{share.amount_sol}</div>
						<div class="text-[0.7rem] text-gray-500 font-semibold mt-0.5">SOL</div>
					</div>

					<!-- Column 4: Status / Value -->
					<div class="w-[15%] text-right pr-2 md:pr-0">
						<div
							class="font-bold text-[0.95rem] {share.transaction_status ===
							'FINALIZED'
								? 'text-green-500'
								: 'text-blue-400'}"
						>
							{share.transaction_status === "FINALIZED" ? "Completed" : "Pending"}
						</div>
					</div>

					<!-- Link Icon -->
					<div
						class="hidden md:flex w-[40px] items-center justify-end text-gray-600 group-hover:text-white transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path
								d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
							/><path
								d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
							/></svg
						>
					</div>
				</a>
			{/each}

			{#if displayShares.length === 0}
				<div
					class="text-center py-16 bg-[#1e212b]/50 rounded-lg border border-dashed border-gray-800 {$isHydeStore
						? 'border-red-950/50'
						: ''}"
				>
					<p class="text-gray-500 font-medium">
						No {activeTab.toLowerCase()} donations yet.
					</p>
				</div>
			{/if}
		</div>
	{:else}
		<div class="text-center py-20 text-red-500 font-bold">Failed to load profile.</div>
	{/if}
</div>

<script>
	import { onMount, onDestroy } from "svelte";
	import { page } from "$app/stores";
	import { invalidateAll } from "$app/navigation";
	import {
		isHydeStore,
		themeLockedStore,
		selectedCurrencyStore,
		exchangeRatesStore
	} from "$lib/theme";
	import { formatSol } from "$lib/utils";
	import {
		fetchMarket,
		fetchCharities,
		formatMarket,
		indexCharities,
		fetchShares,
		createShare
	} from "$lib/api";

	let currentBet = $state(null);
	let shares = $state([]);
	let loading = $state(true);
	let selectedCause = $state("");
	let donationAmount = $state("");
	let donating = $state(false);
	let refreshing = $state(false);
	let refreshInterval;
	let tickInterval;
	let liveTimeRemaining = $state("");

	function computeTimeRemaining() {
		if (!currentBet) return;
		const remaining = currentBet.endsAt - Date.now();
		if (remaining <= 0) {
			liveTimeRemaining = "Ended";
			return;
		}
		const h = Math.floor(remaining / 3600000);
		const m = Math.floor((remaining % 3600000) / 60000);
		const s = Math.floor((remaining % 60000) / 1000);
		if (h > 0) {
			liveTimeRemaining = `${h}h ${m}m ${s}s`;
		} else if (m > 0) {
			liveTimeRemaining = `${m}m ${s}s`;
		} else {
			liveTimeRemaining = `${s}s`;
		}
	}

	function getCurrencySymbol(curr) {
		if (curr === "USD" || curr === "CAD") return "$";
		if (curr === "EUR") return "€";
		return "";
	}

	function getCurrencyLabel() {
		return $selectedCurrencyStore;
	}

	function convertSol(sol) {
		const curr = $selectedCurrencyStore;
		const rates = $exchangeRatesStore;
		if (curr === "USD") return `$${(sol * rates.usd).toFixed(2)} USD`;
		if (curr === "CAD") return `$${(sol * rates.cad).toFixed(2)} CAD`;
		if (curr === "EUR") return `€${(sol * rates.eur).toFixed(2)} EUR`;
		return `${formatSol(sol)} SOL`;
	}

	async function handleDonate() {
		if (!donationAmount || donationAmount <= 0) return;

		if (currentBet.endsAt < Date.now()) {
			alert("This market has ended. Donations are no longer accepted.");
			return;
		}

		const charityId =
			selectedCause === currentBet.optionA.name
				? currentBet.optionA.market_charity_id
				: currentBet.optionB.market_charity_id;

		try {
			donating = true;
			await createShare(currentBet.id, {
				market_charity_id: charityId,
				amount_sol: donationAmount
			});
			await doRefresh();
			donationAmount = "";
		} catch (e) {
			console.error("Donation failed:", e);
			alert(e.message || "Donation failed");
		} finally {
			donating = false;
		}
	}

	// Calculate SVG paths based on historical shares
	let timeframe = $state("All");

	function getChartPaths(sharesData, selectedTimeframe) {
		if (!currentBet || sharesData.length === 0) {
			return {
				top: "M0,0 L100,0 L100,100 L0,100 Z",
				divider: "M0,100 L100,100"
			};
		}

		const aId = currentBet.optionA.market_charity_id;
		const bId = currentBet.optionB.market_charity_id;

		const now = Date.now();
		let cutoff = currentBet.createdAt;

		if (selectedTimeframe === "1H") cutoff = now - 60 * 60 * 1000;
		if (selectedTimeframe === "1D") cutoff = now - 24 * 60 * 60 * 1000;
		if (selectedTimeframe === "1W") cutoff = now - 7 * 24 * 60 * 60 * 1000;
		cutoff = Math.max(cutoff, currentBet.createdAt);

		let totalA = 0;
		let totalB = 0;

		// Calculate background totals up to cutoff
		sharesData.forEach((s) => {
			const t = new Date(s.created_at).getTime();
			if (t <= cutoff) {
				const amount = Number(s.amount_sol) || 0;
				if (s.market_charity_id === aId) totalA += amount;
				if (s.market_charity_id === bId) totalB += amount;
			}
		});

		const sharesInRange = sharesData.filter((s) => new Date(s.created_at).getTime() > cutoff);

		let startTime, endTime;
		if (sharesInRange.length === 0) {
			startTime = cutoff;
			endTime = now;
		} else {
			const times = sharesInRange.map((s) => new Date(s.created_at).getTime());
			startTime = Math.min(...times);
			endTime = Math.max(...times);
		}

		const timeRange = Math.max(endTime - startTime, 1000);
		const initialSum = totalA + totalB;
		const initialY = initialSum === 0 ? 100 : 100 - (totalA / initialSum) * 100;
		const points = [{ x: 0, y: initialY }];

		sharesInRange
			.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
			.forEach((share) => {
				const t = new Date(share.created_at).getTime();
				const amount = Number(share.amount_sol) || 0;
				if (share.market_charity_id === aId) totalA += amount;
				if (share.market_charity_id === bId) totalB += amount;

				const sum = totalA + totalB;
				const y = sum === 0 ? 100 : 100 - (totalA / sum) * 100;
				const x = Math.max(0, Math.min(100, ((t - startTime) / timeRange) * 100));
				points.push({ x, y });
			});

		// Ensure we draw the line to the very end edge (100%)
		points.push({ x: 100, y: points[points.length - 1].y });

		// Build the divider path using smooth Bézier curves
		let dividerPath = "";
		for (let i = 0; i < points.length; i++) {
			if (i === 0) {
				dividerPath += `M${points[i].x.toFixed(1)},${points[i].y.toFixed(1)}`;
			} else {
				const prev = points[i - 1];
				const curr = points[i];
				const cpx = (prev.x + curr.x) / 2;
				dividerPath += ` C${cpx.toFixed(1)},${prev.y.toFixed(1)} ${cpx.toFixed(1)},${curr.y.toFixed(1)} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`;
			}
		}

		// Top fill follows the smooth curve then closes up
		let topPath = `M0,0 `;
		for (let i = 0; i < points.length; i++) {
			if (i === 0) {
				topPath += `L${points[i].x.toFixed(1)},${points[i].y.toFixed(1)}`;
			} else {
				const prev = points[i - 1];
				const curr = points[i];
				const cpx = (prev.x + curr.x) / 2;
				topPath += ` C${cpx.toFixed(1)},${prev.y.toFixed(1)} ${cpx.toFixed(1)},${curr.y.toFixed(1)} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`;
			}
		}
		topPath += ` L100,0 Z`;

		return { top: topPath, divider: dividerPath };
	}

	let chartPaths = $derived(getChartPaths(shares, timeframe));

	// ── Roulette state ──
	let showRoulette = $state(false);
	let rouletteSpinning = $state(false);
	let rouletteWinner = $state(null);
	let rouletteRotation = $state(0);
	let authUser = $state(null);

	let rouletteSlices = $derived.by(() => {
		if (shares.length === 0) return [];

		const total = shares.reduce((sum, s) => sum + Number(s.amount_sol), 0);
		if (total === 0) return [];

		let currentAngle = 0;
		return shares.map((s) => {
			const fraction = Number(s.amount_sol) / total;
			const angleStr = fraction * 360;
			const startAngle = currentAngle;
			const endAngle = currentAngle + angleStr;
			currentAngle += angleStr;

			const isOptionA = s.market_charity_id === currentBet.optionA.market_charity_id;
			let color;

			if (currentBet.isHyde) {
				// Hyde: Red vs Dark Red
				color = isOptionA ? "#ef4444" : "#991b1b";
			} else {
				// Jekyll: Blue vs Green
				color = isOptionA ? "#3b82f6" : "#10b981";
			}

			return { ...s, fraction, startAngle, endAngle, color };
		});
	});

	async function triggerRoulette() {
		if (showRoulette) return;
		showRoulette = true;

		if (authUser) {
			try {
				await fetch(`/api/markets/${currentBet.id}/seen`, {
					method: "POST"
				});
			} catch (e) {
				console.error("Failed to mark as seen:", e);
			}
		}

		setTimeout(() => {
			if (!currentBet.winning_share) return;
			const winnerSlice = rouletteSlices.find((s) => s.id === currentBet.winning_share);
			if (!winnerSlice) return;

			const sliceCenter =
				winnerSlice.startAngle + (winnerSlice.endAngle - winnerSlice.startAngle) / 2;
			const spins = 360 * 5;
			const targetRotation = spins + (360 - sliceCenter);

			rouletteRotation = targetRotation;
			rouletteSpinning = true;

			setTimeout(() => {
				rouletteSpinning = false;
				rouletteWinner = winnerSlice;
			}, 5500);
		}, 100);
	}

	function getAxisLabels(selectedTimeframe) {
		const now = new Date();
		const labels = [];
		const count = 4;

		if (selectedTimeframe === "1H") {
			for (let i = 0; i < count; i++) {
				const d = new Date(now.getTime() - (count - 1 - i) * 15 * 60 * 1000);
				labels.push(
					d.toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit"
					})
				);
			}
		} else if (selectedTimeframe === "1D") {
			for (let i = 0; i < count; i++) {
				const d = new Date(now.getTime() - (count - 1 - i) * 6 * 60 * 60 * 1000);
				labels.push(
					d.toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit"
					})
				);
			}
		} else if (selectedTimeframe === "1W") {
			for (let i = 0; i < count; i++) {
				const d = new Date(now.getTime() - (count - 1 - i) * 2 * 24 * 60 * 60 * 1000);
				labels.push(
					d.toLocaleDateString([], {
						month: "short",
						day: "numeric"
					})
				);
			}
		} else {
			if (!currentBet) return ["", "", "", "Now"];
			const start = currentBet.createdAt;
			const range = now.getTime() - start;
			for (let i = 0; i < count; i++) {
				const d = new Date(start + (i / (count - 1)) * range);
				labels.push(
					d.toLocaleDateString([], {
						month: "short",
						day: "numeric"
					})
				);
			}
		}
		return labels;
	}

	let axisLabels = $derived(getAxisLabels(timeframe));

	async function doRefresh() {
		try {
			const [rawMarket, rawCharities, rawShares] = await Promise.all([
				fetchMarket($page.params.id),
				fetchCharities(),
				fetchShares($page.params.id),
				invalidateAll()
			]);
			const lookup = indexCharities(rawCharities);
			currentBet = formatMarket(rawMarket, lookup);
			shares = rawShares;
			refreshing = true;

			if (
				currentBet.status === "COMPLETE" &&
				!showRoulette &&
				!sessionStorage.getItem("seen_" + currentBet.id)
			) {
				triggerRoulette();
				sessionStorage.setItem("seen_" + currentBet.id, "true");
			}

			setTimeout(() => {
				refreshing = false;
			}, 500);
		} catch (e) {
			console.error("Refresh failed:", e);
		}
	}

	onMount(async () => {
		try {
			const [rawMarket, rawCharities, rawShares, authRes] = await Promise.all([
				fetchMarket($page.params.id),
				fetchCharities(),
				fetchShares($page.params.id),
				fetch("/api/auth/status")
			]);
			const lookup = indexCharities(rawCharities);
			currentBet = formatMarket(rawMarket, lookup);
			shares = rawShares;

			const authData = await authRes.json();
			if (authData.status) authUser = authData.user;

			if (currentBet.status === "COMPLETE") {
				const myUnseen = shares.filter((s) => s.user_id === authUser?.id && !s.seen_result);
				if (myUnseen.length > 0 || !sessionStorage.getItem("seen_" + currentBet.id)) {
					triggerRoulette();
					sessionStorage.setItem("seen_" + currentBet.id, "true");
				}
			}

			if (currentBet.isHyde) {
				$isHydeStore = true;
			} else {
				$isHydeStore = false;
			}
			$themeLockedStore = true;
			selectedCause = currentBet.optionA.name;
		} catch (e) {
			console.error("Failed to load market:", e);
		} finally {
			loading = false;
		}

		refreshInterval = setInterval(doRefresh, 5000);
		computeTimeRemaining();
		tickInterval = setInterval(computeTimeRemaining, 1000);
	});

	$effect(() => {
		if (typeof document !== "undefined" && currentBet) {
			$isHydeStore = currentBet.isHyde;
		}
	});

	onDestroy(() => {
		$themeLockedStore = false;
		if (refreshInterval) clearInterval(refreshInterval);
		if (tickInterval) clearInterval(tickInterval);
	});
</script>

{#if loading}
	<div class="flex items-center justify-center min-h-[60vh]">
		<p class="text-gray-400 text-sm">Loading market...</p>
	</div>
{:else if !currentBet}
	<div class="flex items-center justify-center min-h-[60vh]">
		<p class="text-gray-500 text-sm">Market not found.</p>
	</div>
{:else}
	<section
		class="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 mt-2 w-full items-start"
	>
		<!-- ===== LEFT COLUMN ===== -->
		<div class="space-y-4">
			<!-- Chart Box -->
			<div class="relative p-0 flex flex-col overflow-hidden">
				<div class="mb-2 pt-4">
					<h1 class="text-2xl md:text-3xl font-bold tracking-tight var-text-primary mb-2">
						{currentBet.title}
					</h1>
					<!-- Percentages left, time buttons right -->
					<div class="flex justify-between items-center mb-2">
						<div class="flex items-baseline gap-4">
							<span
								class="text-base md:text-lg font-bold var-color-optionA var-text-israel"
								class:shake={refreshing}
							>
								{currentBet.chance}% {currentBet.optionA.name}
							</span>
							<span
								class="text-base md:text-lg font-bold var-text-palestine"
								class:shake={refreshing}
							>
								{currentBet.totalSol === 0 ? 0 : 100 - currentBet.chance}% {currentBet
									.optionB.name}
							</span>
						</div>
						<div class="flex gap-2 text-xs text-gray-500 var-text-muted">
							<button
								onclick={() => (timeframe = "1H")}
								class="hover:text-white var-hover-text px-2 py-1 rounded {timeframe ===
								'1H'
									? 'bg-gray-800 var-bg-muted text-white var-text-primary'
									: ''}">1H</button
							>
							<button
								onclick={() => (timeframe = "1D")}
								class="hover:text-white var-hover-text px-2 py-1 rounded {timeframe ===
								'1D'
									? 'bg-gray-800 var-bg-muted text-white var-text-primary'
									: ''}">1D</button
							>
							<button
								onclick={() => (timeframe = "1W")}
								class="hover:text-white var-hover-text px-2 py-1 rounded {timeframe ===
								'1W'
									? 'bg-gray-800 var-bg-muted text-white var-text-primary'
									: ''}">1W</button
							>
							<button
								onclick={() => (timeframe = "All")}
								class="hover:text-white var-hover-text px-2 py-1 rounded {timeframe ===
								'All'
									? 'bg-gray-800 var-bg-muted text-white var-text-primary'
									: ''}">All</button
							>
						</div>
					</div>

					<!-- Chart Area -->
					<div
						class="group h-[280px] relative w-full mt-2 rounded-lg overflow-hidden border border-gray-800/80 var-border-card"
					>
						<div
							class="absolute inset-0 var-bg-optionA-medium var-bg-israel-medium"
						></div>
						<svg
							class="absolute inset-0 w-full h-full"
							viewBox="0 0 100 100"
							preserveAspectRatio="none"
						>
							<!-- Top Polygon (Option B color) -->
							<path
								d={chartPaths.top}
								fill="currentColor"
								class="var-color-optionB var-text-palestine opacity-20"
							/>
							<!-- Divider Line -->
							<path
								d={chartPaths.divider}
								fill="none"
								class="var-stroke-divider"
								stroke="#e5e7eb"
								stroke-width="1.5"
								vector-effect="non-scaling-stroke"
							/>
						</svg>
						<!-- Hover Tooltip -->
						<div
							class="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-white var-bg-tooltip text-black var-text-tooltip p-2 rounded text-xs font-bold shadow-xl pointer-events-none -translate-x-1/2 -translate-y-full"
							style="top: {100 - currentBet.chance}%; left: 80%;"
						>
							<div>Current Ratio</div>
							<div class="flex flex-col gap-1 mt-1">
								<span class="var-color-optionA var-text-israel"
									>{currentBet.optionA.name}: {currentBet.chance}%</span
								>
								<span class="var-text-palestine"
									>{currentBet.optionB.name}: {100 - currentBet.chance}%</span
								>
							</div>
						</div>
					</div>

					<!-- Axis Labels -->
					<div class="flex justify-between text-xs text-gray-500 var-text-muted mt-2">
						{#each axisLabels as label}
							<span>{label}</span>
						{/each}
					</div>

					<!-- Market Description -->
					{#if currentBet.description}
						<p class="text-gray-400 text-sm leading-relaxed mt-4 break-words">
							{currentBet.description}
						</p>
					{/if}
				</div>
			</div>

			<!-- Leaderboard (separate card) -->
			<div class="overflow-visible text-sm mb-6">
				<table class="w-full text-left">
					<thead
						class="text-gray-500 var-text-muted border-b border-gray-800 var-border-card"
					>
						<tr>
							<th class="py-3 px-4 font-medium w-12">#</th>
							<th class="py-3 px-4 font-medium">Donor</th>
							<th class="py-3 px-4 font-medium">Supported</th>
							<th class="py-3 px-4 font-medium text-right">Amount</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-800/60 var-divide-card font-medium">
						{#if shares.length === 0}
							<tr>
								<td colspan="4" class="py-6 text-center text-gray-600 text-xs"
									>No donations yet</td
								>
							</tr>
						{:else}
							{#each [...shares].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) as share, idx}
								<tr class="hover:bg-gray-800/30 transition-colors">
									<td class="py-3 px-4 text-gray-400">{shares.length - idx}</td>
									<td class="py-3 px-4">
										<a
											href="/profile/{share.user_id}"
											class="text-blue-400 hover:text-blue-300 hover:underline transition-colors font-semibold"
										>
											{share.username || "Anonymous"}
										</a>
									</td>
									<td class="py-3 px-4">
										{#if share.market_charity_id === currentBet.optionA.market_charity_id}
											<span class="var-color-optionA"
												>{currentBet.optionA.name}</span
											>
										{:else if share.market_charity_id === currentBet.optionB.market_charity_id}
											<span class="var-color-optionB"
												>{currentBet.optionB.name}</span
											>
										{:else}
											<span class="text-gray-400">Unknown</span>
										{/if}
									</td>
									<td class="py-3 px-4 text-right font-bold text-gray-200">
										{convertSol(Number(share.amount_sol))}
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>

			<!-- Charity Info Cards -->
			<div class="space-y-4 w-full overflow-hidden">
				<h3 class="text-xl font-bold text-white mb-2">About the Causes</h3>
				{#each [currentBet.optionA.charity, currentBet.optionB.charity] as charity}
					{#if charity}
						<div
							class="bg-[#11141c] border border-gray-800 rounded-2xl p-6 flex flex-col gap-3 shadow-lg transition-colors duration-700 w-full overflow-hidden"
						>
							<div class="flex items-center gap-4">
								{#if charity.logo_url}
									<img
										src={charity.logo_url}
										alt={charity.name}
										class="w-12 h-12 rounded-full object-cover bg-gray-800 shrink-0"
									/>
								{:else}
									<div
										class="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-400 shrink-0"
									>
										{charity.name.charAt(0)}
									</div>
								{/if}
								{#if charity.link}
									<a
										href={charity.link}
										target="_blank"
										rel="noopener noreferrer"
										class="text-lg font-bold text-blue-400 hover:text-blue-300 transition-colors w-full break-words underline"
									>
										{charity.name}
									</a>
								{:else}
									<h4 class="text-lg font-bold text-white w-full break-words">
										{charity.name}
									</h4>
								{/if}
							</div>
							{#if charity.description}
								<p
									class="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap break-words w-full"
								>
									{charity.description}
								</p>
							{/if}
						</div>
					{/if}
				{/each}
			</div>
		</div>

		<!-- ===== RIGHT COLUMN ===== -->
		<div class="sticky top-24 self-start space-y-3">
			<!-- Make an Impact Card -->
			<div
				class="bg-[#11141c] transition-colors duration-700 border border-gray-800 rounded-2xl p-6 shadow-2xl"
			>
				<!-- Header with timer -->
				<div
					class="flex items-center justify-between mb-4 pb-4 border-b border-gray-800/80 var-border-card"
				>
					<h2 class="text-xl font-bold text-white transition-colors duration-700">
						Make an Impact
					</h2>
					<div
						class="flex items-center gap-1.5 text-sm font-mono font-bold bg-gray-800/50 var-bg-muted px-2.5 py-1 rounded text-gray-300 var-text-primary"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="text-gray-500 var-text-muted"
							><circle cx="12" cy="12" r="10" /><polyline
								points="12 6 12 12 16 14"
							/></svg
						>
						{liveTimeRemaining}
					</div>
				</div>

				<!-- Choose Cause -->
				<div class="grid grid-cols-2 gap-3 mb-6">
					<button
						class="py-4 flex flex-col items-center justify-center rounded-xl border-2 font-bold cursor-pointer transition-colors
                    {selectedCause === currentBet.optionA.name
							? 'border-current'
							: 'border-gray-700 bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200'}"
						onclick={() => (selectedCause = currentBet.optionA.name)}
					>
						<span>{currentBet.optionA.name}</span>
					</button>
					<button
						class="py-4 flex flex-col items-center justify-center rounded-xl border-2 font-bold cursor-pointer transition-colors
                    {selectedCause === currentBet.optionB.name
							? 'border-current'
							: 'border-gray-700 bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200'}"
						onclick={() => (selectedCause = currentBet.optionB.name)}
					>
						<span>{currentBet.optionB.name}</span>
					</button>
				</div>

				<!-- Amount -->
				<div class="space-y-3 relative group">
					<div class="flex justify-between items-center text-sm font-medium">
						<span
							class="text-gray-400 var-text-muted group-focus-within:text-white transition-colors"
							>Donation Amount ({getCurrencyLabel()})</span
						>
						<span
							class="text-gray-500 var-text-muted hover:text-white cursor-pointer transition-colors"
							onclick={() => (donationAmount = 0)}>Balance: {convertSol(0)}</span
						>
					</div>
					<div class="relative">
						<span
							class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-white transition-colors"
						>
							{#if $selectedCurrencyStore === "SOL"}
								<svg
									class="w-5 h-5"
									viewBox="0 0 397 311"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									><path
										d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
										fill="currentColor"
									/><path
										d="M64.6 3.8C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
										fill="currentColor"
									/><path
										d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
										fill="currentColor"
									/></svg
								>
							{:else}
								<span class="text-xl font-bold"
									>{getCurrencySymbol($selectedCurrencyStore)}</span
								>
							{/if}
						</span>
						<input
							type="text"
							inputmode="decimal"
							min="0"
							placeholder="0"
							bind:value={donationAmount}
							oninput={(e) => {
								e.target.value = e.target.value
									.replace(/[^0-9.]/g, "")
									.replace(/(\..*)\./g, "$1");
								donationAmount = e.target.value;
							}}
							class="w-full bg-black border border-gray-700 rounded-xl py-4 pl-10 pr-4 text-right text-2xl font-bold text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all no-spinners"
						/>
					</div>
					<div class="flex gap-2 text-xs font-semibold">
						<button
							class="flex-1 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors cursor-pointer"
							onclick={() =>
								(donationAmount = Number(
									(Number(donationAmount || 0) + 0.1).toFixed(9)
								))}>+0.1</button
						>
						<button
							class="flex-1 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors cursor-pointer"
							onclick={() =>
								(donationAmount = Number(
									(Number(donationAmount || 0) + 0.5).toFixed(9)
								))}>+0.5</button
						>
						<button
							class="flex-1 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors cursor-pointer"
							onclick={() =>
								(donationAmount = Number(
									(Number(donationAmount || 0) + 1).toFixed(9)
								))}>+1</button
						>
						<button
							class="flex-1 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors cursor-pointer"
							onclick={() =>
								(donationAmount = Number(
									(Number(donationAmount || 0) + 5).toFixed(9)
								))}>+5</button
						>
						<button
							class="flex-1 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors cursor-pointer"
							onclick={() => (donationAmount = authUser ? authUser.balance_sol : 0)}
							>Max</button
						>
					</div>
				</div>

				<div class="mt-6">
					<button
						onclick={handleDonate}
						disabled={donating}
						class="w-full py-4 bg-white hover:bg-gray-200 disabled:opacity-50 text-black font-extrabold text-lg rounded-xl shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_0_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all cursor-pointer tracking-wide"
					>
						{donating
							? "Donating..."
							: `Donate ${donationAmount ? `${getCurrencySymbol($selectedCurrencyStore)}${donationAmount} ${getCurrencyLabel()}` : "Now"}`}
					</button>
				</div>
			</div>

			<!-- Total Pot -->
			<div
				class="bg-[#11141c] transition-colors duration-700 border border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between"
			>
				<span class="text-sm text-gray-400 font-semibold">Total Pot</span>
				<span class="text-lg font-extrabold text-white" class:shake={refreshing}
					>{convertSol(currentBet.totalSol)}</span
				>
			</div>

			<!-- Terms -->
			<p class="text-center text-xs text-gray-500 px-2 mt-2">
				By donating you agree to our
				<a href="/terms" class="underline hover:text-gray-300 transition-colors"
					>Terms of Service</a
				>.
			</p>
		</div>
	</section>
{/if}

<!-- ROULETTE OVERLAY -->
{#if showRoulette}
	<div
		class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
	>
		<h2 class="text-3xl md:text-5xl font-black text-white mb-12 tracking-wider uppercase">
			Results
		</h2>

		<div class="relative w-72 h-72 md:w-96 md:h-96">
			<!-- Center Pointer -->
			<div
				class="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-8 h-12 bg-white flex items-end justify-center rounded-t-lg shadow-[0_0_20px_white]"
			>
				<div
					class="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[24px] border-l-transparent border-r-transparent border-t-white -mb-6"
				></div>
			</div>

			<svg
				viewBox="-100 -100 200 200"
				class="w-full h-full transform transition-transform ease-[cubic-bezier(0.25,0.1,0.25,1)]"
				style="transform: rotate({rouletteRotation}deg); transition-duration: 5s;"
			>
				<circle cx="0" cy="0" r="95" fill="#111" stroke="#333" stroke-width="2" />
				{#each rouletteSlices as slice}
					<path
						d="M0,0 L{Math.cos((slice.startAngle - 90) * (Math.PI / 180)) *
							95},{Math.sin((slice.startAngle - 90) * (Math.PI / 180)) *
							95} A95,95 0 {slice.endAngle - slice.startAngle > 180
							? 1
							: 0},1 {Math.cos((slice.endAngle - 90) * (Math.PI / 180)) *
							95},{Math.sin((slice.endAngle - 90) * (Math.PI / 180)) * 95} Z"
						fill={slice.color}
						stroke="#000"
						stroke-width="1"
					/>
				{/each}
				<!-- Inner black hole -->
				<circle cx="0" cy="0" r="15" fill="#000" />
			</svg>
		</div>

		{#if rouletteWinner && !rouletteSpinning}
			<div
				class="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-500"
			>
				<div
					class="bg-gray-900 border-2 border-green-500 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(34,197,94,0.4)]"
				>
					<h3 class="text-green-500 font-bold tracking-widest text-sm uppercase mb-4">
						Winner Selected
					</h3>
					{#if rouletteWinner.avatar_url}
						<img
							src={rouletteWinner.avatar_url}
							alt="Winner"
							class="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-white shadow-lg"
						/>
					{/if}
					<div class="text-3xl font-black text-white mb-2">
						{rouletteWinner.username || "Anonymous"}
					</div>

					<div class="bg-black/50 rounded-lg p-4 mt-6">
						<div class="flex justify-between items-center mb-2">
							<span class="text-gray-400 text-sm">Winning Bet:</span>
							<span class="text-white font-bold"
								>{formatSol(rouletteWinner.amount_sol)} SOL</span
							>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-gray-400 text-sm">Donated to:</span>
							<span class="text-white font-bold max-w-[150px] truncate text-right">
								{rouletteWinner.market_charity_id ===
								currentBet.optionA.market_charity_id
									? currentBet.optionA.name
									: currentBet.optionB.name}
							</span>
						</div>
					</div>

					<button
						class="mt-8 w-full py-3 bg-white text-black font-bold uppercase tracking-wider rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
						onclick={() => {
							showRoulette = false;
						}}
					>
						View Results
					</button>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20% {
			transform: translateX(-2px);
		}
		40% {
			transform: translateX(2px);
		}
		60% {
			transform: translateX(-1px);
		}
		80% {
			transform: translateX(1px);
		}
	}
	:global(.shake) {
		animation: shake 0.35s ease-in-out;
	}
</style>

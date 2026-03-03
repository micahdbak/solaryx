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
	import { formatSol, formatTimeRemaining, convertSol } from "$lib/utils";
	import {
		fetchMarket,
		fetchCharities,
		formatMarket,
		indexCharities,
		fetchShares,
		createShare
	} from "$lib/api";
	import confetti from "canvas-confetti";
	import Graph from "$lib/components/Graph.svelte";
	import RouletteOverlay from "$lib/components/RouletteOverlay.svelte";
	import DonationSidebar from "$lib/components/DonationSidebar.svelte";
	import MarketReceipt from "$lib/components/MarketReceipt.svelte";

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
		liveTimeRemaining = formatTimeRemaining(currentBet.endsAt);
	}

	function fmtSol(sol) {
		return convertSol(sol, $selectedCurrencyStore, $exchangeRatesStore);
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

	// Historical shares timeframe setting
	let timeframe = $state("All");

	// ── Roulette state ──
	let showRoulette = $state(false);
	let rouletteSpinning = $state(false);
	let rouletteWinner = $state(null);
	let rouletteRotation = $state(0);
	let ballRotation = $state(0);
	let ballRadius = $state(41);
	let authUser = $state(null);

	let winnerShare = $derived(
		currentBet?.winning_share
			? (shares.find((s) => s.id === currentBet.winning_share) ?? null)
			: null
	);

	let winnerCharityName = $derived(() => {
		if (!winnerShare || !currentBet) return "";
		return winnerShare.market_charity_id === currentBet.optionA.market_charity_id
			? currentBet.optionA.name
			: currentBet.optionB.name;
	});

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
				color = isOptionA ? "#c45a5a" : "#7a3535";
			} else {
				color = isOptionA ? "#7aa2f7" : "#7dcfff";
			}

			return { ...s, fraction, startAngle, endAngle, color };
		});
	});

	async function triggerRoulette() {
		if (showRoulette) return;
		showRoulette = true;
		ballRadius = 41;

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

			const wheelSpins = 360 * 8;
			const targetWheelRotation = wheelSpins + (360 - sliceCenter);

			rouletteRotation = targetWheelRotation;

			const ballSpins = -360 * 12;
			ballRotation = ballSpins;

			rouletteSpinning = true;

			setTimeout(() => {
				ballRadius = 27;
			}, 5000);

			setTimeout(() => {
				rouletteSpinning = false;
				rouletteWinner = winnerSlice;

				confetti({
					particleCount: 150,
					spread: 80,
					origin: { y: 0.6 }
				});
			}, 8500);
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

			// Get fresh user from layout data
			const layoutData = $page.data;
			if (layoutData?.user) authUser = layoutData.user;

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
			const [rawMarket, rawCharities, rawShares] = await Promise.all([
				fetchMarket($page.params.id),
				fetchCharities(),
				fetchShares($page.params.id)
			]);
			const lookup = indexCharities(rawCharities);
			currentBet = formatMarket(rawMarket, lookup);
			shares = rawShares;

			// Use layout data for auth instead of separate fetch
			const layoutData = $page.data;
			if (layoutData?.user) authUser = layoutData.user;

			if (currentBet.status === "COMPLETE") {
				const myUnseen = shares.filter((s) => s.user_id === authUser?.id && !s.seen_result);
				if (myUnseen.length > 0 || !sessionStorage.getItem("seen_" + currentBet.id)) {
					triggerRoulette();
					sessionStorage.setItem("seen_" + currentBet.id, "true");
				}
			}

			$isHydeStore = currentBet.isHyde;
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

	onDestroy(() => {
		if (refreshInterval) clearInterval(refreshInterval);
		if (tickInterval) clearInterval(tickInterval);
		$themeLockedStore = false;
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
								{currentBet.chance}% {currentBet.optionA.name} ({formatSol(
									currentBet.optionA.totalSol
								)} SOL)
							</span>
							<span
								class="text-base md:text-lg font-bold var-text-palestine"
								class:shake={refreshing}
							>
								{currentBet.totalSol === 0 ? 0 : 100 - currentBet.chance}% {currentBet
									.optionB.name} ({formatSol(currentBet.optionB.totalSol)} SOL)
							</span>
						</div>
						<div class="flex gap-2 text-xs text-gray-500 var-text-muted">
							<button
								onclick={() => (timeframe = "1H")}
								class="hover:text-[#e0e4f0] var-hover-text px-2 py-1 rounded {timeframe ===
								'1H'
									? 'bg-gray-800 var-bg-muted text-[#e0e4f0] var-text-primary'
									: ''}">1H</button
							>
							<button
								onclick={() => (timeframe = "1D")}
								class="hover:text-[#e0e4f0] var-hover-text px-2 py-1 rounded {timeframe ===
								'1D'
									? 'bg-gray-800 var-bg-muted text-[#e0e4f0] var-text-primary'
									: ''}">1D</button
							>
							<button
								onclick={() => (timeframe = "1W")}
								class="hover:text-[#e0e4f0] var-hover-text px-2 py-1 rounded {timeframe ===
								'1W'
									? 'bg-gray-800 var-bg-muted text-[#e0e4f0] var-text-primary'
									: ''}">1W</button
							>
							<button
								onclick={() => (timeframe = "All")}
								class="hover:text-[#e0e4f0] var-hover-text px-2 py-1 rounded {timeframe ===
								'All'
									? 'bg-gray-800 var-bg-muted text-[#e0e4f0] var-text-primary'
									: ''}">All</button
							>
						</div>
					</div>

					<!-- Chart Area -->
					<Graph {shares} {currentBet} {timeframe} bind:selectedCause />

					<!-- Axis Labels -->
					<div class="flex justify-between text-xs text-gray-500 var-text-muted mt-2">
						{#each axisLabels as label}
							<span>{label}</span>
						{/each}
					</div>

					<!-- Market Description -->
					{#if currentBet.description}
						<p
							class="text-[var(--text-muted)] text-sm leading-relaxed mt-4 break-words"
						>
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
								<tr class="hover:bg-[var(--bg-muted)]/30 transition-colors">
									<td class="py-3 px-4 text-[var(--text-muted)]"
										>{shares.length - idx}</td
									>
									<td class="py-3 px-4">
										<a
											href="/profile/{share.user_id}"
											class="text-[var(--color-primary)] hover:brightness-125 hover:underline transition-colors font-semibold"
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
											<span class="text-[var(--text-muted)]">Unknown</span>
										{/if}
									</td>
									<td
										class="py-3 px-4 text-right font-bold text-[var(--text-primary)]"
									>
										{fmtSol(Number(share.amount_sol))}
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>

			<!-- Charity Info Cards -->
			<div class="space-y-4 w-full overflow-hidden">
				<h3 class="text-xl font-bold text-[var(--text-primary)] mb-2">About the Causes</h3>
				{#each [currentBet.optionA.charity, currentBet.optionB.charity] as charity}
					{#if charity}
						<div
							class="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 flex flex-col gap-3 shadow-lg transition-colors duration-700 w-full overflow-hidden"
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
										class="text-lg font-bold text-[var(--color-primary)] hover:brightness-125 transition-colors w-full break-words underline"
									>
										{charity.name}
									</a>
								{:else}
									<h4
										class="text-lg font-bold text-[var(--text-primary)] w-full break-words"
									>
										{charity.name}
									</h4>
								{/if}
							</div>
							{#if charity.description}
								<p
									class="text-[var(--text-muted)] text-sm leading-relaxed whitespace-pre-wrap break-words w-full"
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
			{#if currentBet.status === "COMPLETE" && winnerShare}
				<MarketReceipt {currentBet} {winnerShare} winnerCharityName={winnerCharityName()} />
			{:else}
				<DonationSidebar
					{currentBet}
					bind:selectedCause
					bind:donationAmount
					{donating}
					{liveTimeRemaining}
					{authUser}
					onDonate={handleDonate}
				/>

				<!-- Total Pot -->
				<div
					class="bg-[var(--bg-card)] transition-colors duration-700 border border-[var(--border-card)] rounded-xl px-5 py-4 flex items-center justify-between"
				>
					<span class="text-sm text-[var(--text-muted)] font-semibold">Total Pot</span>
					<span
						class="text-lg font-extrabold text-[var(--text-primary)]"
						class:shake={refreshing}>{fmtSol(currentBet.totalSol)}</span
					>
				</div>

				<!-- Terms -->
				<p class="text-center text-xs text-[var(--text-muted)] px-2 mt-2">
					By donating you agree to our
					<a
						href="/terms"
						class="underline hover:text-[var(--text-primary)] transition-colors"
						>Terms of Service</a
					>.
				</p>
			{/if}
		</div>
	</section>
{/if}

<!-- ROULETTE OVERLAY -->
{#if showRoulette}
	<RouletteOverlay
		{rouletteSlices}
		{rouletteRotation}
		{ballRotation}
		{ballRadius}
		{rouletteSpinning}
		{rouletteWinner}
		{currentBet}
		onclose={() => {
			showRoulette = false;
		}}
	/>
{/if}

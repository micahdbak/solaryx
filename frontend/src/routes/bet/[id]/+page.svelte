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
	import confetti from "canvas-confetti";
	import Graph from "$lib/components/Graph.svelte";

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
				// Hyde: Muted red vs Dark muted red
				color = isOptionA ? "#c45a5a" : "#7a3535";
			} else {
				// Jekyll: Tokyo Night blue vs cyan
				color = isOptionA ? "#7aa2f7" : "#7dcfff";
			}

			return { ...s, fraction, startAngle, endAngle, color };
		});
	});

	async function triggerRoulette() {
		if (showRoulette) return;
		showRoulette = true;
		ballRadius = 41; // Start radius (outer rim track)

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

			// Wheel spins 8 times clockwise
			const wheelSpins = 360 * 8;
			const targetWheelRotation = wheelSpins + (360 - sliceCenter);

			rouletteRotation = targetWheelRotation;

			// Ball spins counter-clockwise fast
			// The winning slice aligns perfectly to the TOP of the container.
			// Since our ball wrapper's neutral position (top: Y, left: 50%) is also the TOP,
			// ballRotation ends at exactly a multiple of 360 to align perfectly.
			const ballSpins = -360 * 12;
			ballRotation = ballSpins; // Top position

			rouletteSpinning = true;

			// Ball drop animation: transition radius inward down to the inner slices
			setTimeout(() => {
				ballRadius = 27;
			}, 5000);

			setTimeout(() => {
				rouletteSpinning = false;
				rouletteWinner = winnerSlice;

				// Fire confetti
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
			const [rawMarket, rawCharities, rawShares, authRes] = await Promise.all([
				fetchMarket($page.params.id),
				fetchCharities(),
				fetchShares($page.params.id),
				fetch("/api/auth/status"),
				invalidateAll()
			]);
			const lookup = indexCharities(rawCharities);
			currentBet = formatMarket(rawMarket, lookup);
			shares = rawShares;

			const authData = await authRes.json();
			if (authData.status) authUser = authData.user;

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
				<!-- ── Receipt card (persistent after market ends) ── -->
				<div class="bg-[#11141c] border border-green-900/40 rounded-2xl p-6 shadow-2xl">
					<div
						class="flex items-center justify-between mb-5 pb-4 border-b border-gray-800/80"
					>
						<h2 class="text-xl font-bold text-white">Market Ended</h2>
						<span
							class="text-xs font-bold bg-green-900/40 text-green-400 px-2.5 py-1 rounded-full uppercase tracking-widest"
							>Complete</span
						>
					</div>

					<!-- Winner -->
					<div class="text-center py-2 mb-4">
						{#if winnerShare.avatar_url}
							<img
								src={winnerShare.avatar_url}
								alt="Winner"
								class="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-green-500/50 shadow-lg"
							/>
						{:else}
							<div
								class="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-black text-gray-400 mx-auto mb-3"
							>
								{(winnerShare.username || "A").charAt(0).toUpperCase()}
							</div>
						{/if}
						<a
							href="/profile/{winnerShare.user_id}"
							class="text-xl font-black text-white hover:text-green-300 transition-colors"
						>
							{winnerShare.username || "Anonymous"}
						</a>
						<p class="text-gray-500 text-xs mt-1">Lucky Donor</p>
					</div>

					<!-- Stats -->
					<div class="bg-black/40 rounded-xl p-4 space-y-3">
						<div class="flex justify-between items-center">
							<span class="text-gray-400 text-sm">Winning Bet</span>
							<span class="text-white font-bold"
								>{convertSol(Number(winnerShare.amount_sol))}</span
							>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-gray-400 text-sm">Total Donated</span>
							<span class="text-green-400 font-extrabold text-lg"
								>{convertSol(currentBet.totalSol)}</span
							>
						</div>
						<div
							class="flex justify-between items-center pt-3 border-t border-gray-800/60"
						>
							<span class="text-gray-400 text-sm">Charity</span>
							<span class="text-white font-bold max-w-[160px] text-right truncate"
								>{winnerCharityName()}</span
							>
						</div>
					</div>

					<!-- Transaction -->
					{#if currentBet.payout_tx}
						<div class="mt-4 bg-green-950/30 border border-green-900/40 rounded-xl p-4">
							<div class="flex items-center gap-2 mb-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-4 h-4 text-green-400 shrink-0"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									><polyline points="20 6 9 17 4 12" /></svg
								>
								<span
									class="text-green-400 text-xs font-bold uppercase tracking-widest"
									>Donation Sent On-Chain</span
								>
							</div>
							<p class="font-mono text-xs text-gray-500 truncate mb-3">
								{currentBet.payout_tx}
							</p>
							<a
								href="https://explorer.solana.com/tx/{currentBet.payout_tx}"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center justify-center gap-2 w-full py-2.5 bg-green-900/30 hover:bg-green-900/50 border border-green-800/50 rounded-lg text-green-400 text-sm font-semibold transition-colors"
							>
								View on Solana Explorer
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-3.5 h-3.5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><path
										d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
									/><polyline points="15 3 21 3 21 9" /><line
										x1="10"
										y1="14"
										x2="21"
										y2="3"
									/></svg
								>
							</a>
						</div>
					{:else}
						<div
							class="mt-4 flex items-center gap-2 text-gray-500 text-xs justify-center py-3"
						>
							<svg
								class="w-3.5 h-3.5 animate-spin"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								><circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								/><path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v8z"
								/></svg
							>
							Submitting donation on-chain...
						</div>
					{/if}
				</div>
			{:else}
				<!-- Make an Impact Card -->
				<div
					class="bg-[var(--bg-card)] transition-colors duration-700 border border-[var(--border-card)] rounded-2xl p-6 shadow-2xl"
				>
					<!-- Header with timer -->
					<div
						class="flex items-center justify-between mb-4 pb-4 border-b border-gray-800/80 var-border-card"
					>
						<h2
							class="text-xl font-bold text-[var(--text-primary)] transition-colors duration-700"
						>
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
							class="py-4 flex flex-col items-center justify-center rounded-xl font-bold cursor-pointer transition-all duration-200 hover-vibrate
                    {selectedCause === currentBet.optionA.name
								? 'bg-[#224d37] text-[#4ade80] shadow-[0_0_12px_rgba(34,77,55,0.4)]'
								: 'bg-[#142a1e] text-[#2d6b4a] hover:bg-[#224d37] hover:text-white'}"
							onclick={() => (selectedCause = currentBet.optionA.name)}
						>
							<span>{currentBet.optionA.name}</span>
						</button>
						<button
							class="py-4 flex flex-col items-center justify-center rounded-xl font-bold cursor-pointer transition-all duration-200 hover-vibrate
                    {selectedCause === currentBet.optionB.name
								? 'bg-[#4d2222] text-[#ef4444] shadow-[0_0_12px_rgba(77,34,34,0.4)]'
								: 'bg-[#2a1414] text-[#6b2d2d] hover:bg-[#4d2222] hover:text-white'}"
							onclick={() => (selectedCause = currentBet.optionB.name)}
						>
							<span>{currentBet.optionB.name}</span>
						</button>
					</div>

					<!-- Amount -->
					<div class="space-y-3 relative group">
						<div class="flex justify-between items-center text-sm font-medium">
							<span
								class="text-gray-400 var-text-muted group-focus-within:text-[#e0e4f0] transition-colors"
								>Donation Amount ({getCurrencyLabel()})</span
							>
							<span
								class="text-gray-500 var-text-muted hover:text-[#e0e4f0] cursor-pointer transition-colors"
								onclick={() =>
									(donationAmount = authUser ? authUser.balance_sol : 0)}
								>Balance: {convertSol(authUser ? authUser.balance_sol : 0)}</span
							>
						</div>
						<div class="relative">
							<span
								class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-[#e0e4f0] transition-colors"
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
								class="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl py-4 pl-10 pr-4 text-right text-2xl font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all no-spinners"
							/>
						</div>
						<div class="flex gap-2 text-xs font-semibold">
							<button
								class="flex-1 py-2 bg-[var(--bg-muted)]/80 hover:bg-[var(--bg-muted)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
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
								onclick={() =>
									(donationAmount = authUser ? authUser.balance_sol : 0)}
								>Max</button
							>
						</div>
					</div>

					<div class="mt-6">
						<button
							onclick={handleDonate}
							disabled={donating}
							class="w-full py-4 bg-[var(--donate-bg)] hover:bg-[var(--donate-bg-hover)] border-none disabled:opacity-50 text-[var(--donate-text)] hover:text-white font-extrabold text-lg rounded-xl shadow-[var(--donate-shadow)] hover:shadow-[var(--donate-shadow-hover)] active:scale-[0.98] transition-all cursor-pointer tracking-wide hover-vibrate"
						>
							{donating
								? "Donating..."
								: `Donate ${donationAmount ? `${getCurrencySymbol($selectedCurrencyStore)}${donationAmount} ${getCurrencyLabel()}` : "Now"}`}
						</button>
					</div>
				</div>

				<!-- Total Pot -->
				<div
					class="bg-[var(--bg-card)] transition-colors duration-700 border border-[var(--border-card)] rounded-xl px-5 py-4 flex items-center justify-between"
				>
					<span class="text-sm text-[var(--text-muted)] font-semibold">Total Pot</span>
					<span
						class="text-lg font-extrabold text-[var(--text-primary)]"
						class:shake={refreshing}>{convertSol(currentBet.totalSol)}</span
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
	<div
		class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
	>
		<h2
			class="relative z-10 text-3xl md:text-5xl font-black text-white/90 mb-6 tracking-wider uppercase drop-shadow-2xl"
		>
			Results
		</h2>

		<!-- Minimal Green Felt Table Container -->
		<div
			class="relative w-[320px] h-[320px] md:w-[480px] md:h-[480px] bg-[#0f381c] rounded-full shadow-2xl flex items-center justify-center border-4 border-[#0a2412]"
			style="background-image: radial-gradient(circle at center, #1b532d 0%, #081c0e 100%);"
		>
			<!-- The Wheel Container -->
			<div class="relative w-[300px] h-[300px] md:w-[460px] md:h-[460px] z-10">
				<!-- Outer Wood Rim -->
				<div
					class="absolute inset-0 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_4px_15px_rgba(255,255,255,0.2),inset_0_-4px_30px_rgba(0,0,0,0.9)] border-[20px] md:border-[28px] border-[#5e3818] bg-[#222]"
				></div>
				<!-- Inner Metallic Rim (Track Delimiter) -->
				<div
					class="absolute inset-[20px] md:inset-[28px] rounded-full border-[3px] border-[#a38052] bg-[#111] shadow-[inset_0_8px_20px_rgba(0,0,0,0.9)]"
				></div>

				<!-- Wheel SVG -->
				<svg
					viewBox="-100 -100 200 200"
					class="absolute inset-[24px] md:inset-[32px] w-[calc(100%-48px)] md:w-[calc(100%-64px)] h-[calc(100%-48px)] md:h-[calc(100%-64px)] transform transition-transform filter drop-shadow-xl"
					style="transform: rotate({rouletteRotation}deg); transition-duration: 8.5s; transition-timing-function: cubic-bezier(0.1, 0.85, 0.15, 1);"
				>
					<defs>
						<radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
							<stop offset="0%" stop-color="#cfb078" />
							<stop offset="70%" stop-color="#916c31" />
							<stop offset="100%" stop-color="#4a3512" />
						</radialGradient>
						<filter id="insetShadow">
							<feOffset dx="0" dy="0" />
							<feGaussianBlur stdDeviation="2" result="offset-blur" />
							<feComposite
								operator="out"
								in="SourceGraphic"
								in2="offset-blur"
								result="inverse"
							/>
							<feFlood flood-color="black" flood-opacity="0.7" result="color" />
							<feComposite operator="in" in="color" in2="inverse" result="shadow" />
							<feComposite operator="over" in="shadow" in2="SourceGraphic" />
						</filter>
					</defs>

					<circle cx="0" cy="0" r="95" fill="#111" />
					{#each rouletteSlices as slice}
						<path
							d="M0,0 L{Math.cos((slice.startAngle - 90) * (Math.PI / 180)) *
								95},{Math.sin((slice.startAngle - 90) * (Math.PI / 180)) *
								95} A95,95 0 {slice.endAngle - slice.startAngle > 180
								? 1
								: 0},1 {Math.cos((slice.endAngle - 90) * (Math.PI / 180)) *
								95},{Math.sin((slice.endAngle - 90) * (Math.PI / 180)) * 95} Z"
							fill={slice.color}
							stroke="#d4af37"
							stroke-width="0.75"
						/>
						<!-- Number pocket separators -->
						<line
							x1={Math.cos((slice.startAngle - 90) * (Math.PI / 180)) * 40}
							y1={Math.sin((slice.startAngle - 90) * (Math.PI / 180)) * 40}
							x2={Math.cos((slice.startAngle - 90) * (Math.PI / 180)) * 95}
							y2={Math.sin((slice.startAngle - 90) * (Math.PI / 180)) * 95}
							stroke="#fff"
							stroke-width="0.5"
							opacity="0.3"
						/>

						{#if slice.endAngle - slice.startAngle > 8}
							<text
								x="65"
								y="0"
								fill="white"
								font-size="6.5"
								font-weight="bold"
								text-anchor="middle"
								dominant-baseline="central"
								transform="rotate({slice.startAngle +
									(slice.endAngle - slice.startAngle) / 2 -
									90})"
								style="text-shadow: 0px 1px 2px rgba(0,0,0,0.8);"
							>
								{slice.username
									? slice.username.length > 10
										? slice.username.substring(0, 8) + ".."
										: slice.username
									: "Anon"}
							</text>
						{/if}
					{/each}

					<!-- Inner dark area -->
					<circle cx="0" cy="0" r="45" fill="#1a1a1a" filter="url(#insetShadow)" />

					<!-- Center Turret / Boss -->
					<circle
						cx="0"
						cy="0"
						r="28"
						fill="url(#centerGrad)"
						stroke="#ffdf73"
						stroke-width="1.5"
					/>
					<!-- Turret Spokes -->
					<path
						d="M-22,0 L22,0 M0,-22 L0,22"
						stroke="#ffdf73"
						stroke-width="4"
						stroke-linecap="round"
						filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.5))"
					/>
					<!-- Turret Center Nut -->
					<circle cx="0" cy="0" r="6" fill="#ffd700" stroke="#be9122" stroke-width="1" />
				</svg>

				<!-- The Spinning Ball -->
				<div
					class="absolute inset-0 pointer-events-none origin-center transition-transform"
					style="transform: rotate({ballRotation}deg); transition-duration: 8.5s; transition-timing-function: cubic-bezier(0.1, 0.7, 0.4, 1);"
				>
					<div
						class="absolute w-3.5 h-3.5 md:w-5 md:h-5 rounded-full bg-white shadow-[0_4px_6px_rgba(0,0,0,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] transition-all"
						style="top: calc(50% - {ballRadius}%); left: 50%; transform: translate(-50%, -50%); transition-duration: 3.5s; transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);"
					></div>
				</div>
			</div>
		</div>
		<!-- End Green Felt Table Container -->

		{#if rouletteWinner && !rouletteSpinning}
			<div
				class="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-500"
			>
				<div
					class="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl"
				>
					<div class="text-xs font-bold text-green-400 uppercase tracking-widest mb-5">
						Winner Selected
					</div>

					{#if rouletteWinner.avatar_url}
						<img
							src={rouletteWinner.avatar_url}
							alt="Winner"
							class="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-white shadow-lg"
						/>
					{:else}
						<div
							class="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-3xl font-black text-gray-300 mx-auto mb-3"
						>
							{(rouletteWinner.username || "A").charAt(0).toUpperCase()}
						</div>
					{/if}
					<div class="text-2xl font-black text-white">
						{rouletteWinner.username || "Anonymous"}
					</div>
					<div class="text-gray-500 text-xs mt-1 mb-5">Lucky Donor</div>

					<!-- Total pot hero -->
					<div class="bg-black/50 rounded-xl p-4 mb-4">
						<div class="text-gray-400 text-xs mb-1">Total Pot Donated to</div>
						<div class="text-green-400 font-black text-3xl">
							{convertSol(currentBet.totalSol)}
						</div>
						<div class="text-white font-bold mt-1">
							{rouletteWinner.market_charity_id ===
							currentBet.optionA.market_charity_id
								? currentBet.optionA.name
								: currentBet.optionB.name}
						</div>
					</div>

					<div class="flex justify-between items-center px-1 mb-5">
						<span class="text-gray-500 text-sm">Winning Bet</span>
						<span class="text-white font-bold"
							>{convertSol(Number(rouletteWinner.amount_sol))}</span
						>
					</div>

					{#if currentBet.payout_tx}
						<div
							class="bg-green-950/40 border border-green-800/40 rounded-xl p-3 mb-5 text-left"
						>
							<div class="flex items-center gap-1.5 mb-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-3.5 h-3.5 text-green-400 shrink-0"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									><polyline points="20 6 9 17 4 12" /></svg
								>
								<span
									class="text-green-400 text-xs font-bold uppercase tracking-widest"
									>Donation Confirmed</span
								>
							</div>
							<p class="font-mono text-xs text-gray-500 truncate mb-2.5">
								{currentBet.payout_tx.slice(0, 10)}…{currentBet.payout_tx.slice(
									-10
								)}
							</p>
							<a
								href="https://explorer.solana.com/tx/{currentBet.payout_tx}"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 font-semibold transition-colors"
							>
								View on Solana Explorer
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-3 h-3"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><path
										d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
									/><polyline points="15 3 21 3 21 9" /><line
										x1="10"
										y1="14"
										x2="21"
										y2="3"
									/></svg
								>
							</a>
						</div>
					{:else}
						<div
							class="flex items-center justify-center gap-2 text-gray-500 text-xs mb-5 py-3 bg-black/30 rounded-xl"
						>
							<svg
								class="w-3.5 h-3.5 animate-spin"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								><circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								/><path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v8z"
								/></svg
							>
							Submitting donation on-chain…
						</div>
					{/if}

					<button
						class="w-full py-3 bg-white text-black font-bold uppercase tracking-wider rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
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

	@keyframes vibrate {
		0%,
		100% {
			transform: translateX(0);
		}
		10% {
			transform: translateX(-1px);
		}
		20% {
			transform: translateX(1px);
		}
		30% {
			transform: translateX(-1px);
		}
		40% {
			transform: translateX(1px);
		}
		50% {
			transform: translateX(-0.5px);
		}
		60% {
			transform: translateX(0.5px);
		}
		70% {
			transform: translateX(-0.5px);
		}
		80% {
			transform: translateX(0.5px);
		}
	}
	:global(.hover-vibrate:hover) {
		animation: vibrate 0.4s ease-in-out;
	}
</style>

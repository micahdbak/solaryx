<script>
	import { onMount, onDestroy } from "svelte";
	import { page } from "$app/stores";
	import { formatTimeRemaining, convertSol, getAxisLabels, handleDonation } from "$lib/utils";
	import { selectedCurrencyStore, exchangeRatesStore } from "$lib/theme";
	import { fetchShares, createShare } from "$lib/api";
	import Graph from "$lib/components/Graph.svelte";
	import DonationSidebar from "$lib/components/DonationSidebar.svelte";
	import SwipeControls from "$lib/components/SwipeControls.svelte";
	import TimeframeControls from "$lib/components/TimeframeControls.svelte";
	import MarketHeaderInfo from "$lib/components/MarketHeaderInfo.svelte";

	let { markets } = $props();

	let trendingBets = $derived(
		markets
			.filter((m) => m.status !== "COMPLETE")
			.sort((a, b) => b.totalSol - a.totalSol)
			.slice(0, 5)
	);

	let currentIndex = $state(0);
	let currentBet = $derived(trendingBets[currentIndex]);

	let shares = $state([]);
	let loadingShares = $state(false);
	let autoRefreshing = $state(false);

	let selectedCause = $state("");
	let donationAmount = $state("");
	let donating = $state(false);
	let timeframe = $state("All");
	let authUser = $derived($page.data?.user);
	let liveTimeRemaining = $state("");
	let tickInterval;
	let refreshInterval;
	let lastLoadedBetId = "";

	function computeTimeRemaining() {
		if (!currentBet) return;
		liveTimeRemaining = formatTimeRemaining(currentBet.endsAt);
	}

	function fmtSol(sol) {
		return convertSol(sol, $selectedCurrencyStore, $exchangeRatesStore);
	}

	async function loadShares(bet, isAutoRefresh = false) {
		if (!bet) return;

		if (isAutoRefresh) {
			autoRefreshing = true;
		} else {
			loadingShares = true;
		}

		try {
			shares = await fetchShares(bet.id);
		} catch (e) {
			console.error("Failed to fetch shares for trending market", e);
			if (!isAutoRefresh) shares = [];
		} finally {
			loadingShares = false;
			autoRefreshing = false;
		}
	}

	$effect(() => {
		if (currentBet && currentBet.id !== lastLoadedBetId) {
			lastLoadedBetId = currentBet.id;
			selectedCause = currentBet.optionA.name;
			loadShares(currentBet, false);
		}
	});

	onMount(() => {
		tickInterval = setInterval(computeTimeRemaining, 1000);
		refreshInterval = setInterval(() => {
			if (currentBet) {
				loadShares(currentBet, true);
			}
		}, 3000);
	});

	onDestroy(() => {
		if (tickInterval) clearInterval(tickInterval);
		if (refreshInterval) clearInterval(refreshInterval);
	});

	function goNext() {
		currentIndex = (currentIndex + 1) % trendingBets.length;
	}

	function goPrev() {
		currentIndex = (currentIndex - 1 + trendingBets.length) % trendingBets.length;
	}

	async function handleDonate() {
		donating = true;
		await handleDonation({
			currentBet,
			selectedCause,
			donationAmount,
			createShare,
			onSuccess: async () => {
				// Refresh shares and markets by calling the parent's reload logic ideally, but reloading shares here works.
				await loadShares(currentBet);
				donationAmount = "";
				donating = false;
			},
			onError: (msg) => {
				alert(msg);
				donating = false;
			}
		});
	}

	let axisLabels = $derived(getAxisLabels(timeframe, currentBet));
</script>

{#if trendingBets.length > 0 && currentBet}
	{@const count = trendingBets.length}
	<section
		class="pb-8 mb-8 border-b border-[var(--border-card)] grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 mt-2 w-full items-start"
	>
		<!-- ===== LEFT COLUMN ===== -->
		<div class="space-y-4">
			<div class="flex items-center justify-between mb-2">
				<h2
					class="text-lg md:text-xl font-bold uppercase tracking-widest text-[#666] var-text-muted flex items-center gap-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-orange-500"
						><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline
							points="16 7 22 7 22 13"
						/></svg
					>
					Trending Markets
				</h2>
				<div class="flex items-center gap-4">
					{#if autoRefreshing}
						<div class="flex items-center gap-2 text-xs text-orange-400">
							<svg
								class="animate-spin h-3 w-3"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Refreshing Chart
						</div>
					{/if}
					{#if count > 1}
						<SwipeControls {count} {currentIndex} {goPrev} {goNext} />
					{/if}
				</div>
			</div>

			<!-- Chart Box -->
			<div
				class="relative p-0 flex flex-col overflow-hidden bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 shadow-sm"
			>
				<div class="mb-2">
					<!-- Percentages left, time buttons right -->
					<div class="flex justify-between items-center mb-2 gap-4">
						<MarketHeaderInfo {currentBet} />
						<TimeframeControls bind:timeframe />
					</div>

					<!-- Chart Area -->
					<div class="w-full mt-4 min-h-[250px] relative">
						<Graph
							{shares}
							{currentBet}
							{timeframe}
							bind:selectedCause
							href="/bet/{currentBet.id}"
						/>
						{#if loadingShares}
							<div
								class="absolute inset-0 flex items-center justify-center bg-[var(--bg-card)]/80 backdrop-blur-sm z-10 transition-opacity duration-300"
							>
								<span class="text-[var(--text-primary)] text-sm font-medium"
									>Loading Chart...</span
								>
							</div>
						{/if}
					</div>

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
		</div>

		<!-- ===== RIGHT COLUMN ===== -->
		<div class="space-y-3 mt-[2.6rem]">
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
				class="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-5 py-4 flex flex-col gap-1"
			>
				<span
					class="text-sm text-[var(--text-muted)] font-semibold uppercase tracking-widest"
					>Total Pot</span
				>
				<div class="flex justify-between items-center">
					<span class="text-2xl font-extrabold text-[var(--text-primary)]"
						>{fmtSol(currentBet.totalSol)}</span
					>
					<span class="text-sm font-medium text-[var(--text-muted)]">SOL</span>
				</div>
			</div>

			<p class="text-center text-xs text-[var(--text-muted)] px-2 mt-2">
				By donating you agree to our <a
					href="/terms"
					class="underline hover:text-[var(--text-primary)] transition-colors"
					>Terms of Service</a
				>.
			</p>
		</div>
	</section>
{/if}

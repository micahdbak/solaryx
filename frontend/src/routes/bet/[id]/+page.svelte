<script>
	import { onMount, onDestroy } from "svelte";
	import { page } from "$app/stores";
	import { isHydeStore, themeLockedStore } from "$lib/theme";
	import { fetchMarket, fetchCharities, formatMarket, indexCharities } from "$lib/api";

	let currentBet = $state(null);
	let loading = $state(true);
	let selectedCause = $state("");
	let donationAmount = $state(0);

	onMount(async () => {
		try {
			const [rawMarket, rawCharities] = await Promise.all([
				fetchMarket($page.params.id),
				fetchCharities()
			]);
			const lookup = indexCharities(rawCharities);
			currentBet = formatMarket(rawMarket, lookup);

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
	});

	$effect(() => {
		if (typeof document !== "undefined" && currentBet) {
			$isHydeStore = currentBet.isHyde;
		}
	});

	onDestroy(() => {
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
			<div
				class="relative bg-[#11141c] {$isHydeStore
					? '!bg-[#200505] !border-[#450a0a]'
					: ''} transition-colors duration-700 rounded-xl border border-gray-800 p-4 flex flex-col overflow-hidden"
			>
				<div class="mb-2 pt-4">
					<h1 class="text-2xl md:text-3xl font-bold tracking-tight var-text-primary mb-2">
						{currentBet.title}
					</h1>
					<!-- Percentages left, time buttons right -->
					<div class="flex justify-between items-center mb-2">
						<div class="flex items-baseline gap-4">
							<span
								class="text-base md:text-lg font-bold var-color-optionA var-text-israel"
							>
								{currentBet.chance}% {currentBet.optionA.name}
							</span>
							<span class="text-base md:text-lg font-bold var-text-palestine">
								{100 - currentBet.chance}% {currentBet.optionB.name}
							</span>
						</div>
						<div class="flex gap-2 text-xs text-gray-500 var-text-muted">
							<button
								class="hover:text-white var-hover-text px-2 py-1 bg-gray-800 var-bg-muted rounded text-white var-text-primary"
								>1H</button
							>
							<button class="hover:text-white var-hover-text px-2 py-1 rounded"
								>1D</button
							>
							<button class="hover:text-white var-hover-text px-2 py-1 rounded"
								>1W</button
							>
							<button class="hover:text-white var-hover-text px-2 py-1 rounded"
								>All</button
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
							<path
								d="M0,0 L100,0 L100,20 L80,22 L60,18 L40,24 L20,16 L0,20 Z"
								fill="rgba(94, 234, 212, 0.2)"
								class="var-fill-palestine-light"
							/>
							<path
								d="M0,20 L20,16 L40,24 L60,18 L80,22 L100,20"
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
						<span>Jan 1</span>
						<span>Feb 1</span>
						<span>Mar 1</span>
						<span>Today</span>
					</div>
				</div>
			</div>

			<!-- Leaderboard (separate card) -->
			<div
				class="bg-[#11141c] {$isHydeStore
					? '!bg-[#200505] !border-[#450a0a]'
					: ''} transition-colors duration-700 rounded-xl border border-gray-800 overflow-visible text-sm"
			>
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
						<tr>
							<td colspan="4" class="py-6 text-center text-gray-600 text-xs"
								>No donations yet</td
							>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- ===== RIGHT COLUMN ===== -->
		<div class="sticky top-24 self-start space-y-3">
			<!-- Make an Impact Card -->
			<div
				class="bg-[#11141c] {$isHydeStore
					? '!bg-[#200505] !border-[#450a0a]'
					: ''} transition-colors duration-700 border border-gray-800 rounded-2xl p-6 shadow-2xl"
			>
				<!-- Header with timer -->
				<div
					class="flex items-center justify-between mb-4 pb-4 border-b border-gray-800/80 var-border-card"
				>
					<h2 class="text-xl font-bold text-white var-text-primary">Make an Impact</h2>
					<div class="flex items-center gap-2">
						<span
							class="text-xs text-gray-400 var-text-muted font-bold uppercase tracking-wider"
							>Ends In:</span
						>
						<div
							class="text-sm font-mono text-gray-300 var-text-primary font-bold bg-gray-800/50 var-bg-muted px-2 py-1 rounded"
						>
							{currentBet.timeRemaining}
						</div>
					</div>
				</div>

				<!-- Choose Cause -->
				<div class="grid grid-cols-2 gap-3 mb-6">
					<button
						class="py-4 flex flex-col items-center justify-center rounded-xl border-2 font-bold cursor-pointer transition-colors
                    {selectedCause === currentBet.optionA.name
							? 'border-current shadow-[0_0_10px_currentColor]'
							: 'border-gray-700 bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200'}"
						onclick={() => (selectedCause = currentBet.optionA.name)}
					>
						<span>{currentBet.optionA.name}</span>
					</button>
					<button
						class="py-4 flex flex-col items-center justify-center rounded-xl border-2 font-bold cursor-pointer transition-colors
                    {selectedCause === currentBet.optionB.name
							? 'border-current shadow-[0_0_10px_currentColor]'
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
							>Donation Amount (SOL)</span
						>
						<span
							class="text-gray-500 var-text-muted hover:text-white cursor-pointer transition-colors"
							onclick={() => (donationAmount = 0)}>Balance: 0 SOL</span
						>
					</div>
					<div class="relative">
						<span
							class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl pointer-events-none group-focus-within:text-white transition-colors"
							>◎</span
						>
						<input
							type="number"
							min="0"
							placeholder="0"
							bind:value={donationAmount}
							class="w-full bg-black border border-gray-700 rounded-xl py-4 pl-10 pr-4 text-right text-2xl font-bold text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all no-spinners"
						/>
					</div>
					<div class="flex gap-2 text-xs font-semibold">
						<button
							class="flex-1 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors cursor-pointer"
							onclick={() => (donationAmount = Number(donationAmount) + 0.1)}
							>+0.1</button
						>
						<button
							class="flex-1 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors cursor-pointer"
							onclick={() => (donationAmount = Number(donationAmount) + 0.5)}
							>+0.5</button
						>
						<button
							class="flex-1 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors cursor-pointer"
							onclick={() => (donationAmount = Number(donationAmount) + 1)}>+1</button
						>
						<button
							class="flex-1 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors cursor-pointer"
							onclick={() => (donationAmount = Number(donationAmount) + 5)}>+5</button
						>
						<button
							class="flex-1 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors cursor-pointer"
							onclick={() => (donationAmount = 100)}>Max</button
						>
					</div>
				</div>

				<div class="mt-6">
					<button
						class="w-full py-4 bg-white hover:bg-gray-200 text-black font-extrabold text-lg rounded-xl shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_0_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all cursor-pointer tracking-wide"
					>
						Donate {donationAmount ? `${donationAmount} SOL` : "Now"}
					</button>
				</div>
			</div>

			<!-- Terms -->
			<p class="text-center text-xs text-gray-500 px-2">
				By donating you agree to our
				<a href="/terms" class="underline hover:text-gray-300 transition-colors"
					>Terms of Service</a
				>.
			</p>

			<!-- Total Pot -->
			<div
				class="bg-[#11141c] {$isHydeStore
					? '!bg-[#200505] !border-[#450a0a]'
					: ''} transition-colors duration-700 border border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between"
			>
				<span class="text-sm text-gray-400 font-semibold">Total Pot</span>
				<span class="text-lg font-extrabold text-white">{currentBet.vol}</span>
			</div>
		</div>
	</section>
{/if}

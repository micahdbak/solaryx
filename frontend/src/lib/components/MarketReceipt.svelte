<script>
	import { convertSol } from "$lib/utils";
	import { selectedCurrencyStore, exchangeRatesStore } from "$lib/theme";

	let { currentBet, winnerShare, winnerCharityName = "" } = $props();

	function fmtSol(sol) {
		return convertSol(sol, $selectedCurrencyStore, $exchangeRatesStore);
	}
</script>

<div class="bg-[#11141c] border border-green-900/40 rounded-2xl p-6 shadow-2xl">
	<div class="flex items-center justify-between mb-5 pb-4 border-b border-gray-800/80">
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
			<span class="text-white font-bold">{fmtSol(Number(winnerShare.amount_sol))}</span>
		</div>
		<div class="flex justify-between items-center">
			<span class="text-gray-400 text-sm">Total Donated</span>
			<span class="text-green-400 font-extrabold text-lg">{fmtSol(currentBet.totalSol)}</span>
		</div>
		<div class="flex justify-between items-center pt-3 border-t border-gray-800/60">
			<span class="text-gray-400 text-sm">Charity</span>
			<span class="text-white font-bold max-w-[160px] text-right truncate"
				>{winnerCharityName}</span
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
					stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg
				>
				<span class="text-green-400 text-xs font-bold uppercase tracking-widest"
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
					><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline
						points="15 3 21 3 21 9"
					/><line x1="10" y1="14" x2="21" y2="3" /></svg
				>
			</a>
		</div>
	{:else}
		<div class="mt-4 flex items-center gap-2 text-gray-500 text-xs justify-center py-3">
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
				/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg
			>
			Submitting donation on-chain...
		</div>
	{/if}
</div>

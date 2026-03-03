<script>
	import { convertSol, getCurrencySymbol, getCurrencyLabel } from "$lib/utils";
	import { selectedCurrencyStore, exchangeRatesStore } from "$lib/theme";
	import SolanaIcon from "$lib/components/SolanaIcon.svelte";

	let {
		currentBet,
		selectedCause = $bindable(""),
		donationAmount = $bindable(""),
		donating = false,
		liveTimeRemaining = "",
		authUser = null,
		onDonate = () => {}
	} = $props();

	function fmtSol(sol) {
		return convertSol(sol, $selectedCurrencyStore, $exchangeRatesStore);
	}
</script>

<div
	class="bg-[var(--bg-card)] transition-colors duration-700 border border-[var(--border-card)] rounded-2xl p-6 shadow-2xl"
>
	<!-- Header with timer -->
	<div
		class="flex items-center justify-between mb-4 pb-4 border-b border-gray-800/80 var-border-card"
	>
		<h2 class="text-xl font-bold text-[var(--text-primary)] transition-colors duration-700">
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
				><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg
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
				>Donation Amount ({getCurrencyLabel($selectedCurrencyStore)})</span
			>
			<span
				class="text-gray-500 var-text-muted hover:text-[#e0e4f0] cursor-pointer transition-colors"
				onclick={() => (donationAmount = authUser ? authUser.balance_sol : 0)}
				>Balance: {fmtSol(authUser ? authUser.balance_sol : 0)}</span
			>
		</div>
		<div class="relative">
			<span
				class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-[#e0e4f0] transition-colors"
			>
				{#if $selectedCurrencyStore === "SOL"}
					<SolanaIcon class="w-5 h-5" />
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
					(donationAmount = Number((Number(donationAmount || 0) + 0.1).toFixed(9)))}
				>+0.1</button
			>
			<button
				class="flex-1 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors cursor-pointer"
				onclick={() =>
					(donationAmount = Number((Number(donationAmount || 0) + 0.5).toFixed(9)))}
				>+0.5</button
			>
			<button
				class="flex-1 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors cursor-pointer"
				onclick={() =>
					(donationAmount = Number((Number(donationAmount || 0) + 1).toFixed(9)))}
				>+1</button
			>
			<button
				class="flex-1 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors cursor-pointer"
				onclick={() =>
					(donationAmount = Number((Number(donationAmount || 0) + 5).toFixed(9)))}
				>+5</button
			>
			<button
				class="flex-1 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors cursor-pointer"
				onclick={() => (donationAmount = authUser ? authUser.balance_sol : 0)}>Max</button
			>
		</div>
	</div>

	<div class="mt-6">
		<button
			onclick={onDonate}
			disabled={donating}
			class="w-full py-4 bg-[var(--donate-bg)] hover:bg-[var(--donate-bg-hover)] border-none disabled:opacity-50 text-[var(--donate-text)] hover:text-white font-extrabold text-lg rounded-xl shadow-[var(--donate-shadow)] hover:shadow-[var(--donate-shadow-hover)] active:scale-[0.98] transition-all cursor-pointer tracking-wide hover-vibrate"
		>
			{donating
				? "Donating..."
				: `Donate ${donationAmount ? `${getCurrencySymbol($selectedCurrencyStore)}${donationAmount} ${getCurrencyLabel($selectedCurrencyStore)}` : "Now"}`}
		</button>
	</div>
</div>

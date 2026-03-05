<script>
	import { convertSol } from "$lib/utils";
	import { selectedCurrencyStore, exchangeRatesStore } from "$lib/theme";

	let { currentBet } = $props();

	function fmt(sol) {
		return convertSol(sol || 0, $selectedCurrencyStore, $exchangeRatesStore);
	}
</script>

<div class="mb-2">
	<a href="/bet/{currentBet.id}" class="hover:underline">
		<h1 class="text-2xl md:text-3xl font-bold tracking-tight var-text-primary mb-2">
			{currentBet.title}
		</h1>
	</a>
	<div class="flex items-baseline gap-4 mb-2">
		<span class="text-base md:text-lg font-bold var-color-optionA var-text-israel">
			{currentBet.chance}% ({fmt(currentBet.optionA.totalSol)}) {currentBet.optionA.name}
		</span>
		<span class="text-base md:text-lg font-bold var-text-palestine">
			{currentBet.totalSol === 0 ? 0 : 100 - currentBet.chance}% ({fmt(
				currentBet.optionB.totalSol
			)}) {currentBet.optionB.name}
		</span>
	</div>
</div>

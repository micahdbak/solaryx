<script>
	let { timeframe = $bindable() } = $props();

	const options = ["1H", "1D", "1W", "All"];
</script>

<div class="flex gap-2 text-xs text-gray-500 var-text-muted">
	{#each options as option}
		<button
			onclick={() => (timeframe = option)}
			class="hover:text-[#e0e4f0] var-hover-text px-2 py-1 rounded {timeframe === option
				? 'bg-gray-800 var-bg-muted text-[#e0e4f0] var-text-primary'
				: ''}"
		>
			{option}
		</button>
	{/each}
</div>

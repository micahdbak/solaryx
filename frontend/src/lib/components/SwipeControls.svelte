<script>
	let { count, currentIndex, goPrev, goNext } = $props();
</script>

<div class="flex items-center gap-2">
	<button
		onclick={goPrev}
		class="p-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] hover:bg-[var(--bg-muted)] transition-colors var-hover-text text-[var(--text-muted)]"
		aria-label="Previous trending market"
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
			stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg
		>
	</button>
	<span class="text-sm text-[var(--text-muted)] font-medium">
		{currentIndex + 1} / {count}
	</span>
	<button
		onclick={goNext}
		class="p-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] hover:bg-[var(--bg-muted)] transition-colors var-hover-text text-[var(--text-muted)]"
		aria-label="Next trending market"
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
			stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
		>
	</button>
</div>

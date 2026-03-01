<script>
	import { isHydeStore } from "$lib/theme";

	let { cause, buttonLabel = "Donate to Vote", showCompleteOverlay = false } = $props();
</script>

<div class="relative">
	{#if showCompleteOverlay}
		<a
			href="/bet/{cause.id}"
			class="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-xl border-2 border-[var(--text-muted)]/50 hover:bg-black/30 transition-all cursor-pointer no-underline"
		>
			<div
				class="bg-[var(--bg-muted)] text-[var(--text-primary)] font-black text-xl px-6 py-2 rounded-lg shadow-[0_0_16px_rgba(86,95,137,0.3)] transform hover:scale-105 transition-transform tracking-widest"
			>
				COMPLETE
			</div>
		</a>
	{/if}

	<a
		href="/bet/{cause.id}"
		class="reactive-hover bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] border border-[var(--border-card)] hover:border-[var(--text-muted)]/40 transition-all rounded-xl p-4 flex flex-col block no-underline shadow-lg"
	>
		<!-- Title & Header -->
		<div class="flex justify-between items-start mb-5 h-[50px]">
			<div class="flex gap-3">
				<img src={cause.image} alt="icon" class="w-7 h-7 rounded-full mt-0.5 bg-black/20" />
				<h3
					class="text-[0.90rem] font-semibold text-[var(--text-primary)] leading-tight transition-colors line-clamp-3"
				>
					{cause.title}
				</h3>
			</div>
		</div>

		<div class="flex-1 flex flex-col justify-end">
			<!-- Option Rows (Progress Bars) -->
			<div class="flex flex-col gap-2 mb-4">
				<div
					class="relative overflow-hidden rounded bg-black/30 h-8 flex items-center border border-[var(--border-card)]"
				>
					<div
						class="absolute inset-y-0 left-0 var-bg-optionA-medium"
						style="width: {cause.chance}%;"
					></div>
					<div class="relative w-full flex justify-between items-center px-3">
						<span class="text-sm font-bold var-color-optionA z-10 truncate max-w-[70%]"
							>{cause.optionA.name}</span
						>
						<span class="text-[var(--text-primary)] text-sm font-black z-10"
							>{cause.chance}%</span
						>
					</div>
				</div>
				<div
					class="relative overflow-hidden rounded bg-black/30 h-8 flex items-center border border-[var(--border-card)]"
				>
					<div
						class="absolute inset-y-0 left-0 var-bg-optionB-medium"
						style="width: {cause.totalSol === 0 ? 0 : 100 - cause.chance}%;"
					></div>
					<div class="relative w-full flex justify-between items-center px-3">
						<span class="text-sm font-bold var-color-optionB z-10 truncate max-w-[70%]"
							>{cause.optionB.name}</span
						>
						<span class="text-[var(--text-primary)] text-sm font-black z-10"
							>{cause.totalSol === 0 ? 0 : 100 - cause.chance}%</span
						>
					</div>
				</div>
			</div>

			<!-- Single Button -->
			<div class="mb-3">
				<div
					class="w-full py-2.5 rounded font-bold text-sm transition-all text-center text-[var(--donate-text)] bg-[var(--donate-bg)] hover:bg-[var(--donate-bg-hover)] hover:text-white hover-vibrate"
				>
					{buttonLabel}
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div
			class="flex items-center justify-between text-[0.65rem] text-[var(--text-muted)] border-t border-[var(--border-card)] pt-2.5 mt-1 font-semibold"
		>
			<div class="flex gap-2 items-center flex-wrap">
				<span class="text-[var(--text-muted)] flex items-center gap-1">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						class="var-color-optionA"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"
						></polyline></svg
					>
					{cause.timeRemaining}
				</span>
			</div>
			<div class="flex gap-3">
				<span class="text-[var(--text-muted)] text-[0.6rem]">{cause.vol}</span>
			</div>
		</div>
	</a>
</div>

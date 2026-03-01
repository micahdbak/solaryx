<script>
	import { isHydeStore } from "$lib/theme";

	let { cause, buttonLabel = "Donate to Vote", showCompleteOverlay = false } = $props();
</script>

<div class="relative group">
	{#if showCompleteOverlay}
		<a
			href="/bet/{cause.id}"
			class="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-xl border-2 border-gray-500/50 hover:bg-black/30 transition-all cursor-pointer no-underline"
		>
			<div
				class="bg-gray-700 text-gray-200 font-black text-xl px-6 py-2 rounded-lg shadow-[0_0_20px_rgba(156,163,175,0.4)] transform hover:scale-105 transition-transform tracking-widest"
			>
				COMPLETE
			</div>
		</a>
	{/if}

	<a
		href="/bet/{cause.id}"
		class="bg-[#11141c] hover:bg-[#1a1e28] border border-gray-700/50 hover:border-gray-600/50 transition-all rounded-xl p-4 flex flex-col group block no-underline shadow-lg {$isHydeStore
			? 'border-red-900/50 hover:border-red-800/80 bg-red-950/20 hover:bg-red-950/40'
			: ''}"
	>
		<!-- Title & Header -->
		<div class="flex justify-between items-start mb-5 h-[50px]">
			<div class="flex gap-3">
				<img src={cause.image} alt="icon" class="w-7 h-7 rounded-full mt-0.5 bg-black/20" />
				<h3
					class="text-[0.90rem] font-semibold text-gray-200 leading-tight group-hover:text-white transition-colors line-clamp-3"
				>
					{cause.title}
				</h3>
			</div>
		</div>

		<div class="flex-1 flex flex-col justify-end">
			<!-- Option Rows (Progress Bars) -->
			<div class="flex flex-col gap-2 mb-4">
				<div
					class="relative overflow-hidden rounded bg-black/40 h-8 flex items-center border border-gray-800/50 {$isHydeStore
						? 'border-red-950/50'
						: ''}"
				>
					<div
						class="absolute inset-y-0 left-0 var-bg-optionA-medium"
						style="width: {cause.chance}%;"
					></div>
					<div class="relative w-full flex justify-between items-center px-3">
						<span class="text-sm font-bold var-color-optionA z-10 truncate max-w-[70%]"
							>{cause.optionA.name}</span
						>
						<span class="text-white text-sm font-black z-10">{cause.chance}%</span>
					</div>
				</div>
				<div
					class="relative overflow-hidden rounded bg-black/40 h-8 flex items-center border border-gray-800/50 {$isHydeStore
						? 'border-red-950/50'
						: ''}"
				>
					<div
						class="absolute inset-y-0 left-0 var-bg-optionB-medium"
						style="width: {cause.totalSol === 0 ? 0 : 100 - cause.chance}%;"
					></div>
					<div class="relative w-full flex justify-between items-center px-3">
						<span class="text-sm font-bold var-color-optionB z-10 truncate max-w-[70%]"
							>{cause.optionB.name}</span
						>
						<span class="text-white text-sm font-black z-10"
							>{cause.totalSol === 0 ? 0 : 100 - cause.chance}%</span
						>
					</div>
				</div>
			</div>

			<!-- Single Button -->
			<div class="mb-3">
				<div
					class="w-full py-2.5 rounded font-bold text-sm transition-colors text-center text-white/90 bg-white/10 group-hover:bg-white/20 {$isHydeStore
						? 'group-hover:bg-red-500/30 text-red-100'
						: 'group-hover:bg-blue-500/30'}"
				>
					{buttonLabel}
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div
			class="flex items-center justify-between text-[0.65rem] text-gray-400 border-t border-gray-700/50 pt-2.5 mt-1 font-semibold"
		>
			<div class="flex gap-2 items-center flex-wrap">
				<span class="text-gray-500 flex items-center gap-1">
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
				<span class="text-gray-500 text-[0.6rem]">{cause.vol}</span>
			</div>
		</div>
	</a>
</div>

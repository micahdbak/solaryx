<script>
	import { convertSol } from "$lib/utils";
	import { selectedCurrencyStore, exchangeRatesStore } from "$lib/theme";

	let {
		rouletteSlices = [],
		rouletteRotation = 0,
		ballRotation = 0,
		ballRadius = 41,
		rouletteSpinning = false,
		rouletteWinner = null,
		currentBet = null,
		onclose = () => {}
	} = $props();

	function fmtSol(sol) {
		return convertSol(sol, $selectedCurrencyStore, $exchangeRatesStore);
	}
</script>

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
						{fmtSol(currentBet.totalSol)}
					</div>
					<div class="text-white font-bold mt-1">
						{rouletteWinner.market_charity_id === currentBet.optionA.market_charity_id
							? currentBet.optionA.name
							: currentBet.optionB.name}
					</div>
				</div>

				<div class="flex justify-between items-center px-1 mb-5">
					<span class="text-gray-500 text-sm">Winning Bet</span>
					<span class="text-white font-bold"
						>{fmtSol(Number(rouletteWinner.amount_sol))}</span
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
								stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg
							>
							<span class="text-green-400 text-xs font-bold uppercase tracking-widest"
								>Donation Confirmed</span
							>
						</div>
						<p class="font-mono text-xs text-gray-500 truncate mb-2.5">
							{currentBet.payout_tx.slice(0, 10)}…{currentBet.payout_tx.slice(-10)}
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
					onclick={onclose}
				>
					View Results
				</button>
			</div>
		</div>
	{/if}
</div>

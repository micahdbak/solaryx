<script>
	export let data;
	let { topUsers = [], biggestWins = [] } = data;

	let currentTab = "monthly";
	let tabs = [
		{ id: "today", label: "Today" },
		{ id: "weekly", label: "Weekly" },
		{ id: "monthly", label: "Monthly" },
		{ id: "all", label: "All" }
	];

	// Fetch data when tab changes
	async function switchTab(tabId) {
		currentTab = tabId;
		try {
			const res = await fetch(`/api/leaderboard?timeframe=${tabId}`);
			if (res.ok) {
				topUsers = await res.json();
			}
		} catch (err) {
			console.error("Failed to fetch leaderboard data", err);
		}
	}

	function formatAmount(amount) {
		const val = parseFloat(amount || 0);
		return `+$${(val * 100).toLocaleString(undefined, {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		})}`;
	}
</script>

<div class="px-4 py-8 max-w-[1400px] mx-auto min-h-screen text-slate-100 font-sans">
	<div class="flex flex-col lg:flex-row gap-12 items-start relative">
		<!-- Left Main Content: Leaderboard -->
		<div class="flex-1 w-full min-w-0">
			<!-- Header Title -->
			<h1 class="text-4xl font-bold mb-8 tracking-tight">Leaderboard</h1>

			<!-- Filters Toolbar -->
			<div
				class="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4 mb-8"
			>
				<div
					class="flex bg-slate-800/60 p-1 rounded-xl w-full sm:w-auto overflow-x-auto text-sm"
				>
					{#each tabs as tab}
						<button
							class="px-5 py-2 whitespace-nowrap rounded-lg font-medium transition-colors {currentTab ===
							tab.id
								? 'bg-slate-700 text-white shadow-sm'
								: 'text-slate-400 hover:text-slate-200'}"
							onclick={() => switchTab(tab.id)}
						>
							{tab.label}
						</button>
					{/each}
				</div>

				<div class="flex gap-4 w-full sm:w-auto items-center text-sm font-medium">
					<button
						class="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors"
					>
						All Categories
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</div>
			</div>

			<!-- Enhanced Search and Sort Header -->
			<div
				class="bg-[#11141c] border border-gray-800 rounded-xl p-3 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
			>
				<div
					class="flex-1 flex items-center bg-black/20 border border-gray-800/50 rounded-lg px-3 py-2 w-full sm:max-w-xs focus-within:border-gray-600 transition-colors"
				>
					<svg
						class="w-4 h-4 text-gray-400 mr-2 shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<input
						type="text"
						placeholder="Search by username..."
						class="bg-transparent border-none outline-none text-gray-200 placeholder-gray-500 w-full text-sm"
					/>
				</div>

				<div
					class="flex items-center gap-6 text-xs text-gray-400 font-bold uppercase tracking-wider px-2 w-full sm:w-auto overflow-hidden"
				>
					<div
						class="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors"
					>
						Profit/Loss
						<svg
							class="w-3 h-3 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path></svg
						>
					</div>
					<div
						class="hidden sm:flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors"
					>
						Volume
					</div>
				</div>
			</div>

			<!-- Leaderboard Rows -->
			<div class="flex flex-col gap-1">
				{#each topUsers as user, i}
					<div
						class="flex items-center px-4 py-3 hover:bg-slate-800/40 transition-colors rounded-xl text-sm"
					>
						<div class="w-6 text-slate-500 text-xs text-right mr-4 font-mono">
							{i + 1}
						</div>
						<div class="flex-1 flex items-center gap-4">
							<div class="relative w-10 h-10 shrink-0">
								<img
									src={user.avatar_url ||
										"https://api.dicebear.com/7.x/avataaars/svg?seed=" +
											user.username}
									alt="avatar"
									class="w-full h-full rounded-full object-cover shrink-0"
								/>
								{#if i === 0}
									<div
										class="absolute -bottom-1 -left-1 text-lg leading-none filter drop-shadow"
									>
										🥇
									</div>
								{:else if i === 1}
									<div
										class="absolute -bottom-1 -left-1 text-lg leading-none filter drop-shadow"
									>
										🥈
									</div>
								{:else if i === 2}
									<div
										class="absolute -bottom-1 -left-1 text-lg leading-none filter drop-shadow"
									>
										🥉
									</div>
								{/if}
							</div>
							<span class="font-bold text-slate-200 truncate pr-4 text-base"
								>{user.username}</span
							>
						</div>
						<div class="w-32 text-right font-bold text-white tracking-tight">
							{formatAmount(user.total_donated)}
						</div>
						<div class="w-24 text-right text-slate-400 font-medium hidden sm:block">
							${(parseFloat(user.total_donated) * 10 * Math.random()).toLocaleString(
								undefined,
								{
									maximumFractionDigits: 0
								}
							)}
						</div>
					</div>
				{/each}

				{#if topUsers.length === 0}
					<div class="text-center py-12 text-slate-500">
						No data available for this timeframe.
					</div>
				{/if}
			</div>
		</div>

		<!-- Right Side Component: Biggest Wins -->
		<div class="w-full lg:w-[400px] shrink-0 sticky top-24 self-start">
			<div
				class="bg-[#11141c] rounded-2xl p-6 border border-gray-800 shadow-xl shadow-black/20 flex flex-col h-[70vh] lg:h-[80vh] min-h-[500px]"
			>
				<h2 class="text-xl font-bold mb-6 text-white tracking-tight shrink-0">
					Biggest wins this month
				</h2>

				<div
					class="overflow-y-auto flex-1 pr-2 -mr-2 space-y-5
					scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
				>
					{#each biggestWins as win, i}
						<div class="flex items-start gap-4">
							<div class="w-4 text-slate-500 text-xs pt-2 font-mono shrink-0">
								{i + 1}
							</div>

							<img
								src={win.avatar_url ||
									"https://api.dicebear.com/7.x/avataaars/svg?seed=" +
										win.username}
								alt="avatar"
								class="w-10 h-10 rounded-full object-cover shrink-0"
							/>

							<div class="min-w-0 flex-1 leading-tight mt-0.5">
								<div class="flex items-center flex-wrap gap-x-2">
									<span class="font-bold text-slate-200 truncate max-w-[120px]"
										>{win.username}</span
									>
									<span class="text-slate-400 text-xs truncate flex-1"
										>{win.market_title}</span
									>
								</div>
								<div class="text-sm mt-1 flex items-center gap-2">
									<span
										class="text-slate-300 font-medium line-through decoration-slate-500/50"
										>${(parseFloat(win.amount_sol) * 30).toLocaleString(
											undefined,
											{ maximumFractionDigits: 0 }
										)}</span
									>
									<span class="text-[#22c55e] font-bold"
										>→ {formatAmount(win.amount_sol)}</span
									>
								</div>
							</div>
						</div>
					{/each}

					{#if biggestWins.length === 0}
						<div class="text-center py-8 text-slate-500 text-sm">
							No big wins this month yet.
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Custom scrollbar for the biggest wins panel */
	.scrollbar-thin::-webkit-scrollbar {
		width: 4px;
	}
	.scrollbar-thin::-webkit-scrollbar-track {
		background: transparent;
	}
	.scrollbar-thin::-webkit-scrollbar-thumb {
		background-color: #334155;
		border-radius: 20px;
	}
</style>

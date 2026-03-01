<script>
	import {
		isHydeStore,
		themeLockedStore,
		searchQueryStore,
		activeTopicStore,
		selectedCurrencyStore,
		exchangeRatesStore
	} from "$lib/theme";
	import { formatSol } from "$lib/utils";
	import { page } from "$app/stores";
	import { onMount, tick } from "svelte";

	let { data } = $props();
	let isMenuOpen = $state(false);
	let menuContainer = $state(null);

	let isCurrencyMenuOpen = $state(false);
	let currencyMenuContainer = $state(null);

	const topics = ["Trending", "New", "Expiring Soon"];

	let isMobileSearchOpen = $state(false);

	// Sliding pill state
	let topicContainerEl = $state(null);
	let topicBtnEls = [];
	let pillStyle = $state("");

	function updatePill() {
		const idx = topics.indexOf($activeTopicStore);
		if (idx < 0 || !topicBtnEls[idx] || !topicContainerEl) return;
		const btn = topicBtnEls[idx];
		pillStyle = `width: ${btn.offsetWidth}px; transform: translateX(${btn.offsetLeft}px);`;
	}

	onMount(async () => {
		tick().then(updatePill);
		try {
			const res = await fetch(
				"https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd,cad,eur"
			);
			const ratesData = await res.json();
			if (ratesData.solana) {
				$exchangeRatesStore = {
					usd: ratesData.solana.usd,
					cad: ratesData.solana.cad,
					eur: ratesData.solana.eur
				};
			}
		} catch (err) {
			console.error("Failed to fetch exchange rates:", err);
		}
	});

	function handleThemeToggle(e) {
		e.preventDefault();
		if ($themeLockedStore) return;
		$isHydeStore = !$isHydeStore;
	}

	function toggleCurrencyMenu(e) {
		e.preventDefault();
		e.stopPropagation();
		isCurrencyMenuOpen = !isCurrencyMenuOpen;
		if (isCurrencyMenuOpen) isMenuOpen = false;
	}

	function setCurrency(curr) {
		$selectedCurrencyStore = curr;
		isCurrencyMenuOpen = false;
	}

	function toggleMenu(e) {
		e.preventDefault();
		e.stopPropagation();
		isMenuOpen = !isMenuOpen;
		if (isMenuOpen) isCurrencyMenuOpen = false;
	}

	function handleClickOutside(e) {
		if (isMenuOpen && menuContainer && !menuContainer.contains(e.target)) {
			isMenuOpen = false;
		}
		if (
			isCurrencyMenuOpen &&
			currencyMenuContainer &&
			!currencyMenuContainer.contains(e.target)
		) {
			isCurrencyMenuOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<header
	class="sticky top-0 z-50 backdrop-blur transition-colors duration-700 ease-in-out border-b bg-[#0b0f19]/90 border-gray-800/60"
>
	<!-- Navbar -->
	<nav class="flex justify-between items-center px-4 md:px-8 py-4 w-full">
		<div class="flex items-center flex-1">
			<div class="flex items-center gap-1 mr-8 md:mr-12">
				<button
					onclick={handleThemeToggle}
					class="bg-transparent border-none flex items-center justify-center w-12 h-12 text-2xl text-[#e0e4f0] no-underline tracking-wide whitespace-nowrap transition-all cursor-pointer relative {$themeLockedStore
						? 'opacity-50 grayscale scale-95 cursor-not-allowed'
						: 'hover:scale-105'}"
					aria-label="Toggle theme"
					disabled={$themeLockedStore}
				>
					{#if $isHydeStore}
						<img src="/hyde.png" alt="Icon" style="width: 40px; height: 40px;" />
					{:else}
						<img src="/jekyll.png" alt="Icon" style="width: 40px; height: 40px;" />
					{/if}
					{#if $themeLockedStore}
						<div
							class="absolute -bottom-1 -right-1 bg-gray-900/80 rounded-full p-0.5 border border-white/10 scale-75"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-lock text-gray-400"
								><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path
									d="M7 11V7a5 5 0 0 1 10 0v4"
								/></svg
							>
						</div>
					{/if}
				</button>
				<a
					href="/"
					class="font-normal text-xl tracking-wide transition-colors duration-700"
				>
					SOLARYX
				</a>
			</div>
			{#if !["/login", "/signup", "/create", "/create-charity", "/settings", "/terms", "/profile", "/wallet", "/leaderboard"].includes($page.url.pathname)}
				<div class="flex items-center">
					<!-- Desktop Search -->
					<div
						class="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full py-2.5 px-5 w-full max-w-[450px] transition-all duration-300 focus-within:bg-white/[0.08] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
					>
						<svg
							class="w-[18px] h-[18px] text-gray-400 mr-3 shrink-0"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
						</svg>
						<input
							type="text"
							placeholder="Search..."
							class="bg-transparent border-none text-[#e0e4f0] w-full outline-none text-[0.95rem] placeholder-gray-400"
							bind:value={$searchQueryStore}
						/>
					</div>
					<!-- Mobile Search Button -->
					<button
						class="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
						onclick={() => (isMobileSearchOpen = true)}
					>
						<svg
							class="w-5 h-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
						</svg>
					</button>
				</div>
			{/if}
			{#if $page.url.pathname === "/" || $page.url.pathname === "/my-bets"}
				<div
					bind:this={topicContainerEl}
					class="topic-switcher hidden md:flex items-center ml-2 rounded-full p-0.5 bg-white/[0.06] relative"
				>
					<!-- Sliding pill indicator -->
					<div
						class="topic-pill absolute top-0.5 left-0 h-[calc(100%-4px)] rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none bg-white/[0.12] shadow-[0_0_12px_rgba(255,255,255,0.08)]"
						style={pillStyle}
					></div>
					{#each topics as topic, i}
						<button
							bind:this={topicBtnEls[i]}
							onclick={() => {
								$activeTopicStore = topic;
								tick().then(updatePill);
							}}
							class="relative z-10 px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition-colors duration-300 ease-in-out bg-transparent border-none cursor-pointer {$activeTopicStore ===
							topic
								? 'text-[#e0e4f0]'
								: 'text-gray-400 hover:text-gray-200'}"
						>
							{topic}
						</button>
					{/each}
				</div>
			{/if}
		</div>
		<div class="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4">
			<a
				href="/leaderboard"
				class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition-all duration-300 ease-in-out no-underline {$page
					.url.pathname === '/leaderboard'
					? 'bg-white/10 text-[#e0e4f0] shadow-[0_0_10px_rgba(255,255,255,0.1)]'
					: 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}"
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
					stroke-linejoin="round"
					class="lucide lucide-trophy"
					><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path
						d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"
					/><path d="M4 22h16" /><path
						d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"
					/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path
						d="M18 2H6v7a6 6 0 0 0 12 0V2Z"
					/></svg
				>
				<span class="hidden sm:inline">Leaderboard</span>
			</a>

			{#if !data?.user}
				<a
					href="/login"
					class="px-5 py-2 rounded-full font-semibold no-underline transition-all duration-700 text-sm cursor-pointer whitespace-nowrap text-gray-300 bg-transparent hover:text-[#e0e4f0] hover:bg-white/10"
					>LOGIN</a
				>
				<a
					href="/signup"
					class="px-5 py-2 rounded-full font-semibold no-underline transition-all duration-700 text-sm cursor-pointer whitespace-nowrap text-[#e0e4f0] hover:-translate-y-px bg-blue-500 shadow-[0_4px_14px_rgba(59,130,246,0.39)] hover:bg-blue-600 hover:shadow-[0_6px_20px_rgba(59,130,246,0.39)]"
					>SIGN UP</a
				>
			{/if}

			<!-- Authenticated User Links -->
			{#if data?.user}
				<!-- Wallet Balance Pill -->
				<div class="relative" bind:this={currencyMenuContainer}>
					<button
						onclick={toggleCurrencyMenu}
						class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all duration-200 hover:-translate-y-px cursor-pointer bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-[#e0e4f0]"
					>
						{#if $selectedCurrencyStore === "SOL"}
							<svg
								class="w-3.5 h-3.5"
								viewBox="0 0 397 311"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								><path
									d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
									fill="currentColor"
								/><path
									d="M64.6 3.8C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
									fill="currentColor"
								/><path
									d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
									fill="currentColor"
								/></svg
							>
							<span>{formatSol(data.user.balance_sol)} SOL</span>
						{:else if $selectedCurrencyStore === "USD"}
							<span
								>${((data.user.balance_sol ?? 0) * $exchangeRatesStore.usd).toFixed(
									2
								)} USD</span
							>
						{:else if $selectedCurrencyStore === "CAD"}
							<span
								>${((data.user.balance_sol ?? 0) * $exchangeRatesStore.cad).toFixed(
									2
								)} CAD</span
							>
						{:else if $selectedCurrencyStore === "EUR"}
							<span
								>€{((data.user.balance_sol ?? 0) * $exchangeRatesStore.eur).toFixed(
									2
								)} EUR</span
							>
						{/if}
						<svg
							class="w-3 h-3 ml-0.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="6 9 12 15 18 9"></polyline>
						</svg>
					</button>

					<div
						class="dropdown-menu absolute right-0 mt-3 w-32 bg-gray-900 border border-gray-800 rounded-lg shadow-xl transition-all duration-300 z-50 overflow-hidden transform origin-top-right {isCurrencyMenuOpen
							? 'opacity-100 visible scale-100'
							: 'opacity-0 invisible scale-95'}"
					>
						<button
							class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors {$selectedCurrencyStore ===
							'SOL'
								? 'bg-gray-800/50 text-[#e0e4f0] font-bold'
								: ''}"
							onclick={() => setCurrency("SOL")}
						>
							SOL
						</button>
						<button
							class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors {$selectedCurrencyStore ===
							'USD'
								? 'bg-gray-800/50 text-[#e0e4f0] font-bold'
								: ''}"
							onclick={() => setCurrency("USD")}
						>
							USD
						</button>
						<button
							class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors {$selectedCurrencyStore ===
							'CAD'
								? 'bg-gray-800/50 text-[#e0e4f0] font-bold'
								: ''}"
							onclick={() => setCurrency("CAD")}
						>
							CAD
						</button>
						<button
							class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors {$selectedCurrencyStore ===
							'EUR'
								? 'bg-gray-800/50 text-[#e0e4f0] font-bold'
								: ''}"
							onclick={() => setCurrency("EUR")}
						>
							EUR
						</button>
					</div>
				</div>
			{/if}

			<!-- Dropdown -->
			{#if data?.user}
				<div class="relative" bind:this={menuContainer}>
					<button
						onclick={toggleMenu}
						class="flex items-center gap-1 border-none cursor-pointer p-2 text-gray-300 bg-transparent hover:text-[#e0e4f0] hover:bg-white/10 rounded-full transition-all duration-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="3" y1="12" x2="21" y2="12"></line>
							<line x1="3" y1="6" x2="21" y2="6"></line>
							<line x1="3" y1="18" x2="21" y2="18"></line>
						</svg>
					</button>
					<div
						class="dropdown-menu absolute right-0 mt-3 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl transition-all duration-300 z-50 overflow-hidden transform origin-top-right {isMenuOpen
							? 'opacity-100 visible scale-100'
							: 'opacity-0 invisible scale-95'}"
					>
						<a
							href="/profile"
							class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors"
							>Profile</a
						>
						<a
							href="/wallet"
							class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors"
							>Wallet</a
						>
						<a
							href="/create"
							class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors"
							>Create Market</a
						>
						<a
							href="/create-charity"
							class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors"
							>Create Charity</a
						>
						<a
							href="/settings"
							class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors"
							>Settings</a
						>
						<div class="border-t border-gray-800 my-1"></div>
						<a
							href="/logout"
							class="block px-4 py-3 text-sm text-red-500 hover:bg-red-900/30 transition-colors"
							>Logout</a
						>
					</div>
				</div>
			{/if}
		</div>

		<!-- Mobile Search Overlay -->
		{#if isMobileSearchOpen}
			<div class="absolute inset-0 z-[60] bg-[#0b0f19] flex items-center px-4 md:hidden">
				<button
					class="bg-transparent border-none text-gray-400 hover:text-white p-2 mr-2 cursor-pointer"
					onclick={() => (isMobileSearchOpen = false)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-arrow-left"
					>
						<line x1="19" y1="12" x2="5" y2="12"></line>
						<polyline points="12 19 5 12 12 5"></polyline>
					</svg>
				</button>
				<div class="flex-1 relative">
					<svg
						class="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
					<input
						type="text"
						placeholder="Search..."
						class="w-full bg-white/10 border border-white/20 rounded-full py-2.5 pl-10 pr-4 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all text-base"
						bind:value={$searchQueryStore}
						autofocus
					/>
				</div>
			</div>
		{/if}
	</nav>
</header>

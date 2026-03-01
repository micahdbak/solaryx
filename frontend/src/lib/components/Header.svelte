<script>
	import favicon from "$lib/assets/favicon.svg";
	import {
		isHydeStore,
		themeLockedStore,
		searchQueryStore,
		activeTopicStore,
	} from "$lib/theme";
	import { page } from "$app/stores";
	import { onMount } from "svelte";

	let { data } = $props();
	let isMenuOpen = $state(false);
	let menuContainer = $state(null);

	let isCurrencyMenuOpen = $state(false);
	let currencyMenuContainer = $state(null);
	let selectedCurrency = $state("SOL");
	let exchangeRates = $state({ usd: 0, cad: 0, eur: 0 });

	const topics = ["Trending", "Breaking", "New", "Expiring Soon"];

	onMount(async () => {
		try {
			const res = await fetch(
				"https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd,cad,eur",
			);
			const ratesData = await res.json();
			if (ratesData.solana) {
				exchangeRates.usd = ratesData.solana.usd;
				exchangeRates.cad = ratesData.solana.cad;
				exchangeRates.eur = ratesData.solana.eur;
			}
		} catch (err) {
			console.error("Failed to fetch exchange rates:", err);
		}
	});

	function handleLogoClick(e) {
		if ($page.url.pathname === "/") {
			e.preventDefault();
			if ($themeLockedStore) return;
			$isHydeStore = !$isHydeStore;
		}
	}

	function toggleCurrencyMenu(e) {
		e.preventDefault();
		e.stopPropagation();
		isCurrencyMenuOpen = !isCurrencyMenuOpen;
		if (isCurrencyMenuOpen) isMenuOpen = false;
	}

	function setCurrency(curr) {
		selectedCurrency = curr;
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
			<div class="flex items-center gap-4 mr-4 md:mr-8">
				<a
					href="/"
					onclick={handleLogoClick}
					class="bg-transparent border-none flex items-center justify-center relative w-12 h-12 text-2xl font-extrabold text-white no-underline tracking-wide whitespace-nowrap hover:scale-105 transition-transform {$themeLockedStore &&
					$page.url.pathname === '/'
						? 'cursor-not-allowed opacity-80'
						: ''}"
					aria-label="Home"
				>
					<!-- Angel Icon (visible when not hyde) -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="absolute transition-all duration-700 ease-in-out {$isHydeStore
							? 'opacity-0 scale-50 rotate-90 text-red-500'
							: 'opacity-100 scale-100 rotate-0 text-white'}"
						style="width: 32px; height: 32px;"
					>
						<path d="M12 4a3 1 0 1 1 0-2 3 1 0 1 1 0 2z" />
						<path
							d="M11 9.5c-2.5-3-6-3.5-8-2.5 1 2.5 3 4.5 6 4.5 1 0 2-.5 2-2z"
						/>
						<path
							d="M13 9.5c2.5-3 6-3.5 8-2.5-1 2.5-3 4.5-6 4.5-1 0-2-.5-2-2z"
						/>
						<path d="M12 9.5v8.5" />
						<path d="M9 18h6" />
					</svg>

					<!-- Devil Icon (visible when hyde) -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="absolute transition-all duration-700 ease-in-out {$isHydeStore
							? 'opacity-100 scale-100 rotate-0 text-red-500'
							: 'opacity-0 scale-50 -rotate-90 text-white'}"
						style="width: 32px; height: 32px;"
					>
						<path d="M9 8c-3-2-5-5-5-5s2 4 4 5z" />
						<path d="M15 8c3-2 5-5 5-5s-2 4-4 5z" />
						<path d="M12 20A8 8 0 1 0 12 4a8 8 0 0 0 0 16z" />
						<path d="M8 12l2 1" />
						<path d="M16 12l-2 1" />
					</svg>
				</a>
				<span
					class="font-semibold text-xl hidden sm:block tracking-wide transition-colors duration-700 {$isHydeStore
						? 'text-red-500 font-bold'
						: 'text-white'}">SOLARYX</span
				>
			</div>
			{#if $page.url.pathname !== "/login" && $page.url.pathname !== "/signup" && $page.url.pathname !== "/create" && $page.url.pathname !== "/create-charity" && $page.url.pathname !== "/settings" && $page.url.pathname !== "/terms"}
				<div
					class="flex items-center bg-white/5 border border-white/10 rounded-full py-2.5 px-5 w-full max-w-[450px] transition-all duration-300 focus-within:bg-white/[0.08] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
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
						class="bg-transparent border-none text-white w-full outline-none text-[0.95rem] placeholder-gray-400"
						bind:value={$searchQueryStore}
					/>
				</div>
			{/if}
			{#if $page.url.pathname === "/" || $page.url.pathname === "/my-bets"}
				<div class="flex items-center gap-2 ml-2">
					{#each topics as topic}
						<button
							onclick={() => ($activeTopicStore = topic)}
							class="px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition-all duration-300 ease-in-out {$activeTopicStore ===
							topic
								? $isHydeStore
									? 'bg-red-900/40 text-red-100 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
									: 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]'
								: $isHydeStore
									? 'text-red-700 hover:text-red-400 hover:bg-red-900/20'
									: 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}"
						>
							{topic}
						</button>
					{/each}
				</div>
			{/if}
		</div>
		<div class="flex items-center gap-4 pl-4">
			{#if !data?.user}
				<a
					href="/login"
					class="px-5 py-2 rounded-full font-semibold no-underline transition-all duration-700 text-sm cursor-pointer whitespace-nowrap text-gray-300 bg-transparent hover:text-white hover:bg-white/10"
					>LOGIN</a
				>
				<a
					href="/signup"
					class="px-5 py-2 rounded-full font-semibold no-underline transition-all duration-700 text-sm cursor-pointer whitespace-nowrap text-white hover:-translate-y-px {$isHydeStore
						? 'bg-red-600 shadow-[0_4px_14px_rgba(220,38,38,0.4)] hover:bg-red-800 hover:shadow-[0_6px_20px_rgba(220,38,38,0.6)]'
						: 'bg-blue-500 shadow-[0_4px_14px_rgba(59,130,246,0.39)] hover:bg-blue-600 hover:shadow-[0_6px_20px_rgba(59,130,246,0.39)]'}"
					>SIGN UP</a
				>
			{/if}

			<!-- Authenticated User Links -->
			{#if data?.user}
				<a
					href="/my-bets"
					class="px-4 py-1.5 rounded-full font-bold text-sm transition-all duration-300 {$page
						.url.pathname === '/my-bets'
						? $isHydeStore
							? 'bg-red-900/40 text-red-100 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
							: 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]'
						: $isHydeStore
							? 'text-red-700 hover:text-red-400 hover:bg-red-900/20'
							: 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}"
				>
					My Bets
				</a>

				<!-- Wallet Balance Pill -->
				<div class="relative" bind:this={currencyMenuContainer}>
					<button
						onclick={toggleCurrencyMenu}
						class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all duration-200 hover:-translate-y-px cursor-pointer {$isHydeStore
							? 'bg-red-950/30 border-red-900/50 text-red-300 hover:bg-red-900/40'
							: 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'}"
					>
						{#if selectedCurrency === "SOL"}
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
							<span
								>{(data.user.balance_sol ?? 0).toFixed(2)} SOL</span
							>
						{:else if selectedCurrency === "USD"}
							<span
								>${(
									(data.user.balance_sol ?? 0) *
									exchangeRates.usd
								).toFixed(2)} USD</span
							>
						{:else if selectedCurrency === "CAD"}
							<span
								>${(
									(data.user.balance_sol ?? 0) *
									exchangeRates.cad
								).toFixed(2)} CAD</span
							>
						{:else if selectedCurrency === "EUR"}
							<span
								>€{(
									(data.user.balance_sol ?? 0) *
									exchangeRates.eur
								).toFixed(2)} EUR</span
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
							class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors {selectedCurrency ===
							'SOL'
								? 'bg-gray-800/50 text-white font-bold'
								: ''}"
							onclick={() => setCurrency("SOL")}
						>
							SOL
						</button>
						<button
							class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors {selectedCurrency ===
							'USD'
								? 'bg-gray-800/50 text-white font-bold'
								: ''}"
							onclick={() => setCurrency("USD")}
						>
							USD
						</button>
						<button
							class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors {selectedCurrency ===
							'CAD'
								? 'bg-gray-800/50 text-white font-bold'
								: ''}"
							onclick={() => setCurrency("CAD")}
						>
							CAD
						</button>
						<button
							class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors {selectedCurrency ===
							'EUR'
								? 'bg-gray-800/50 text-white font-bold'
								: ''}"
							onclick={() => setCurrency("EUR")}
						>
							EUR
						</button>
					</div>
				</div>
			{/if}

			<!-- Dropdown -->
			<div class="relative" bind:this={menuContainer}>
				<button
					onclick={toggleMenu}
					class="flex items-center gap-1 border-none cursor-pointer p-2 text-gray-300 bg-transparent hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
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
					{#if data?.user}
						<a
							href="/profile"
							class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
							>Profile</a
						>
					{/if}
					<a
						href="/wallet"
						class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
						>Wallet</a
					>
					<a
						href="/create"
						class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
						>Create Market</a
					>
					<a
						href="/create-charity"
						class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
						>Create Charity</a
					>
					<a
						href="/settings"
						class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
						>Settings</a
					>
					{#if data?.user}
						<div class="border-t border-gray-800 my-1"></div>
						<a
							href="/logout"
							class="block px-4 py-3 text-sm text-red-500 hover:bg-red-900/30 transition-colors"
							>Logout</a
						>
					{/if}
				</div>
			</div>
		</div>
	</nav>
</header>

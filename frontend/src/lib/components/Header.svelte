<script>
	import { isHydeStore, themeLockedStore, searchQueryStore, activeTopicStore } from "$lib/theme";
	import { page } from "$app/stores";

	let { data } = $props();
	let isMenuOpen = $state(false);
	let menuContainer = $state(null);

	const topics = ["Trending", "Breaking", "New", "Expiring Soon"];

	function handleLogoClick(e) {
		if ($page.url.pathname === "/") {
			e.preventDefault();
			if ($themeLockedStore) return;
			$isHydeStore = !$isHydeStore;
		}
	}

	function toggleMenu(e) {
		e.preventDefault();
		e.stopPropagation();
		isMenuOpen = !isMenuOpen;
	}

	function handleClickOutside(e) {
		if (isMenuOpen && menuContainer && !menuContainer.contains(e.target)) {
			isMenuOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<header
	class="sticky top-0 z-50 backdrop-blur transition-colors duration-700 ease-in-out border-b {$isHydeStore
		? 'bg-[#1a0000]/90 border-red-900/50'
		: 'bg-[#0b0f19]/90 border-gray-800/60'}"
>
	<!-- Navbar -->
	<nav class="flex justify-between items-center px-4 md:px-8 py-4 w-full">
		<div class="flex items-center gap-4 md:gap-8 flex-1">
			<a
				href="/"
				onclick={handleLogoClick}
				class="bg-transparent border-none flex items-center justify-center relative w-12 h-12 text-2xl font-extrabold text-white no-underline tracking-wide whitespace-nowrap hover:scale-105 transition-transform {$themeLockedStore &&
				$page.url.pathname === '/'
					? 'cursor-not-allowed opacity-80'
					: ''}"
				aria-label="Home"
			>
				<!-- Jekyll Icon (visible when not hyde) -->
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
					<ellipse cx="12" cy="5" rx="5" ry="2" />
					<circle cx="12" cy="12" r="4" />
					<path
						d="M7 12c-2.5 0-5 2.5-5 5 0 2.5 3 2.5 5 0M17 12c2.5 0 5 2.5 5 5 0 2.5-3 2.5-5 0"
					/>
					<path d="M12 16v6" />
					<path d="M9 22h6" />
				</svg>

				<!-- Hyde Icon (visible when hyde) -->
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
					<circle cx="12" cy="12" r="4" />
					<path d="M9 9C8 5 6 4 6 4s2 2 3 5" />
					<path d="M15 9c1-4 3-5 3-5s-2 2-3 5" />
					<path d="M12 16v6" />
					<path d="M12 16c-1.5 2-3 2-3 4" />
				</svg></a
			>
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
			{#if $page.url.pathname === "/"}
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

			<!-- Dropdown -->
			<div class="relative mt-1" bind:this={menuContainer}>
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

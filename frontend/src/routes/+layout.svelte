<script>
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import { isEvilStore, themeLockedStore, searchQueryStore, activeTopicStore } from "$lib/theme";
	import { page } from "$app/stores";

	let { children } = $props();
	let isMenuOpen = $state(false);

	const topics = [
		"Trending",
		"Breaking",
		"New",
		"Expiring Soon",
		"Politics",
		"Culture",
		"Climate & Science"
	];

	function handleLogoClick(e) {
		if ($page.url.pathname === "/") {
			e.preventDefault();
			if ($themeLockedStore) return; // Prevent toggle if locked
			$isEvilStore = !$isEvilStore;
		}
	}

	// Effect to observe store changes and apply to body
	$effect(() => {
		if (typeof document !== "undefined") {
			document.body.classList.toggle("evil-mode", $isEvilStore);
		}
	});

	function toggleMenu(e) {
		e.preventDefault();
		isMenuOpen = !isMenuOpen;
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<header
	class="sticky top-0 z-50 backdrop-blur transition-colors duration-700 ease-in-out border-b {$isEvilStore
		? 'bg-[#1a0000]/90 border-red-900/50'
		: 'bg-[#0b0f19]/90 border-gray-800/60'}"
>
	<nav class="navbar">
		<div class="nav-left-group flex items-center gap-4">
			<a
				href="/"
				onclick={handleLogoClick}
				class="logo bg-transparent border-none flex items-center justify-center relative w-12 h-12 hover:scale-105 transition-transform {$themeLockedStore &&
				$page.url.pathname === '/'
					? 'cursor-not-allowed opacity-80'
					: ''}"
				aria-label="Home"
			>
				<!-- Angel Icon (visible when not evil) -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="absolute transition-all duration-700 ease-in-out {$isEvilStore
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

				<!-- Devil Icon (visible when evil) -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="absolute transition-all duration-700 ease-in-out {$isEvilStore
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
			<div class="search-bar">
				<svg
					class="search-icon"
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
				<input type="text" placeholder="Search..." bind:value={$searchQueryStore} />
			</div>
		</div>
		<div class="nav-right relative">
			<a href="/login" class="btn btn-login">LOGIN</a>
			<a href="/register" class="btn btn-signup">SIGN UP</a>

			<!-- Dropdown -->
			<div class="relative mt-1">
				<button
					onclick={toggleMenu}
					class="btn btn-login flex items-center gap-1 border-none cursor-pointer p-2"
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
						href="/settings"
						class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
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
		</div>
	</nav>

	<!-- Topics Bar linked to Header -->
	{#if $page.url.pathname === "/"}
		<div
			class="flex gap-4 px-6 md:px-8 py-2 overflow-x-auto scrollbar-hide text-sm font-bold transition-colors duration-700 ease-in-out {$isEvilStore
				? 'bg-[#1a0000]'
				: 'bg-[#0b0f19]'}"
		>
			{#each topics as topic}
				<button
					onclick={() => ($activeTopicStore = topic)}
					class="px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 ease-in-out {$activeTopicStore ===
					topic
						? $isEvilStore
							? 'bg-red-900/40 text-red-100 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
							: 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]'
						: $isEvilStore
							? 'text-red-700 hover:text-red-400 hover:bg-red-900/20'
							: 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}"
				>
					{topic}
				</button>
			{/each}
		</div>
	{/if}
</header>
<main>
	{@render children()}
</main>

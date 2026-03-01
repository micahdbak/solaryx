<script>
	import { isHydeStore } from "$lib/theme";

	const menuItems = [
		{
			label: "Account",
			icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
			description: "Manage your profile and account details"
		},
		{
			label: "Security",
			icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
			description: "Password, two-factor authentication"
		},
		{
			label: "Privacy",
			icon: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
			description: "Control your data and visibility"
		},
		{
			label: "Transaction History",
			icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
			description: "View your donation and betting history"
		},
		{
			label: "Terms & Conditions",
			icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
			description: "Read our terms of service"
		},
		{
			label: "Help",
			icon: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01",
			description: "FAQs and troubleshooting"
		},
		{
			label: "Contact",
			icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
			description: "Get in touch with our team"
		}
	];

	let activeItem = $state(null);
</script>

<div class="max-w-3xl mx-auto px-6 md:px-10 py-12">
	<div class="space-y-4">
		{#each menuItems as item}
			<button
				onclick={() => (activeItem = activeItem === item.label ? null : item.label)}
				class="w-full text-left bg-[#11141c] {$isHydeStore
					? '!bg-[#200505] border-red-900/40 hover:border-red-700/60'
					: 'border-gray-800 hover:border-gray-600'} border rounded-xl px-10 py-8 transition-all duration-200 cursor-pointer group"
			>
				<div class="flex items-center gap-6 m-3">
					<div
						class="flex-shrink-0 w-12 h-12 rounded-lg {$isHydeStore
							? 'bg-red-950/40'
							: 'bg-gray-800/80'} flex items-center justify-center transition-colors"
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
							class="{$isHydeStore
								? 'text-red-400'
								: 'text-blue-400'} transition-colors"
						>
							<path d={item.icon}></path>
						</svg>
					</div>
					<div class="flex-1 min-w-0">
						<div class="text-white font-semibold text-sm group-hover:text-gray-100">
							{item.label}
						</div>
						<div
							class="{$isHydeStore
								? 'text-red-800'
								: 'text-gray-500'} text-xs mt-0.5 transition-colors"
						>
							{item.description}
						</div>
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="{$isHydeStore
							? 'text-red-700'
							: 'text-gray-600'} group-hover:translate-x-1 transition-all"
					>
						<path d="m9 18 6-6-6-6"></path>
					</svg>
				</div>
			</button>
		{/each}
	</div>
</div>

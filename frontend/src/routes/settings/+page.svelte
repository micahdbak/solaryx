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

	import { onMount } from "svelte";

	let user = $state(null);
	let newUsername = $state("");
	let saving = $state(false);
	let successMsg = $state("");
	let errorMsg = $state("");

	onMount(async () => {
		try {
			const authRes = await fetch("/api/auth/status");
			const authData = await authRes.json();
			if (authData.status) {
				user = authData.user;
				newUsername = user.username;
			} else {
				// If not logged in, redirect to login
				window.location.href = "/login";
			}
		} catch (e) {
			console.error("Failed to load user state:", e);
		}
	});

	async function updateProfile() {
		if (!user) return;
		if (!newUsername.trim()) {
			errorMsg = "Username cannot be empty";
			return;
		}

		saving = true;
		successMsg = "";
		errorMsg = "";

		try {
			const res = await fetch(`/api/profile/${user.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username: newUsername })
			});

			const data = await res.json();
			if (res.ok) {
				successMsg = "Profile updated successfully!";
				user.username = data.profile.username;
			} else {
				errorMsg = data.error || "Failed to update profile";
			}
		} catch (err) {
			console.error("Error updating profile", err);
			errorMsg = "An error occurred while updating.";
		} finally {
			saving = false;
		}
	}
</script>

<div class="max-w-3xl mx-auto px-6 md:px-10 py-12">
	<div class="space-y-4">
		{#each menuItems as item}
			<button
				onclick={() => (activeItem = activeItem === item.label ? null : item.label)}
				class="w-full text-left bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--text-muted)]/40 rounded-xl px-10 py-8 transition-all duration-200 cursor-pointer group reactive-hover"
			>
				<div class="flex items-center gap-6 m-3">
					<div
						class="flex-shrink-0 w-12 h-12 rounded-lg bg-[var(--bg-muted)] flex items-center justify-center transition-colors"
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
						<div class="text-[#e0e4f0] font-semibold text-sm group-hover:text-gray-100">
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

	<!-- Account Modal -->
	{#if activeItem === "Account"}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
		>
			<div
				class="bg-[#1e212b] border border-gray-800/60 shadow-xl rounded-xl w-full max-w-md p-6 {$isHydeStore
					? 'bg-[#200505] border-red-900/40'
					: ''}"
			>
				<div class="flex justify-between items-center mb-6">
					<h2 class="text-xl font-bold text-[#e0e4f0]">Account Settings</h2>
					<button
						class="text-gray-400 hover:text-[#e0e4f0] transition-colors"
						aria-label="Close modal"
						onclick={() => {
							activeItem = null;
							successMsg = "";
							errorMsg = "";
						}}
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
						>
							<path d="M18 6 6 18" /><path d="m6 6 12 12" />
						</svg>
					</button>
				</div>

				{#if successMsg}
					<div
						class="mb-4 p-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-sm"
					>
						{successMsg}
					</div>
				{/if}

				{#if errorMsg}
					<div
						class="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm"
					>
						{errorMsg}
					</div>
				{/if}

				<div class="mb-4">
					<label
						for="username"
						class="block text-sm font-medium text-[var(--text-muted)] mb-1"
						>Username</label
					>
					<input
						id="username"
						type="text"
						bind:value={newUsername}
						class="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/50 transition-all"
					/>
				</div>

				<div class="flex flex-col gap-3 mt-8">
					<button
						onclick={updateProfile}
						disabled={saving || !user}
						class="w-full bg-[var(--color-primary)] hover:brightness-110 text-[#e0e4f0] font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
					>
						{saving ? "Saving..." : "Save Username"}
					</button>

					<button
						onclick={() => alert("Password change functionality is coming soon.")}
						class="w-full bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-[#e0e4f0] font-bold py-2.5 rounded-lg transition-colors"
					>
						Change Password
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

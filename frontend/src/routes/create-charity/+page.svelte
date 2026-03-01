<script>
	import { isHydeStore } from "$lib/theme";
	import { createCharity } from "$lib/api";

	let name = $state("");
	let description = $state("");
	let link = $state("");
	let logoUrl = $state("");
	let walletAddress = $state("");
	let error = $state("");
	let success = $state("");
	let submitting = $state(false);

	async function handleCreate() {
		error = "";
		success = "";

		if (!name.trim()) {
			error = "Name is required";
			return;
		}

		submitting = true;
		try {
			await createCharity({
				name: name.trim(),
				description: description.trim() || undefined,
				link: link.trim() || undefined,
				logo_url: logoUrl.trim() || undefined,
				wallet_address: walletAddress.trim() || undefined
			});
			success = "Charity created successfully!";
			// Reset form
			name = "";
			description = "";
			link = "";
			logoUrl = "";
			walletAddress = "";
		} catch (ex) {
			error = `${ex.message || ex}`;
		} finally {
			submitting = false;
		}
	}
</script>

<div class="max-w-2xl mx-auto px-6 md:px-10 py-12">
	<h1 class="text-3xl font-extrabold text-[var(--text-primary)] mb-8 tracking-tight">
		Create Charity
	</h1>

	<div class="rounded-2xl border p-8 space-y-6 bg-[var(--bg-card)] border-[var(--border-card)]">
		<!-- Name -->
		<div class="space-y-2">
			<label for="charity-name" class="block text-sm font-semibold text-[var(--text-muted)]"
				>Name</label
			>
			<input
				id="charity-name"
				type="text"
				placeholder="e.g. Red Cross"
				class="w-full rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
				bind:value={name}
			/>
		</div>

		<!-- Description -->
		<div class="space-y-2">
			<label for="charity-desc" class="block text-sm font-semibold text-[var(--text-muted)]"
				>Description</label
			>
			<textarea
				id="charity-desc"
				rows="3"
				placeholder="What does this charity do..."
				class="w-full rounded-lg px-4 py-3 text-[#e0e4f0] placeholder-gray-500 outline-none resize-none transition-colors {$isHydeStore
					? 'bg-[#150000] border border-red-900/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
					: 'bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}"
				bind:value={description}
			></textarea>
		</div>

		<!-- Link -->
		<div class="space-y-2">
			<label for="charity-link" class="block text-sm font-semibold text-[var(--text-muted)]"
				>Website</label
			>
			<input
				id="charity-link"
				type="url"
				placeholder="https://example.org"
				class="w-full rounded-lg px-4 py-3 text-[#e0e4f0] placeholder-gray-500 outline-none transition-colors {$isHydeStore
					? 'bg-[#150000] border border-red-900/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
					: 'bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}"
				bind:value={link}
			/>
		</div>

		<!-- Logo URL -->
		<div class="space-y-2">
			<label for="charity-logo" class="block text-sm font-semibold text-[var(--text-muted)]"
				>Logo URL</label
			>
			<input
				id="charity-logo"
				type="url"
				placeholder="https://example.org/logo.png"
				class="w-full rounded-lg px-4 py-3 text-[#e0e4f0] placeholder-gray-500 outline-none transition-colors {$isHydeStore
					? 'bg-[#150000] border border-red-900/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
					: 'bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}"
				bind:value={logoUrl}
			/>
		</div>

		<!-- Wallet Address -->
		<div class="space-y-2">
			<label for="charity-wallet" class="block text-sm font-semibold text-[var(--text-muted)]"
				>Solana Wallet Address</label
			>
			<input
				id="charity-wallet"
				type="text"
				placeholder="e.g. 7xKX..."
				class="w-full rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors font-mono text-sm bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
				bind:value={walletAddress}
			/>
		</div>

		<!-- Submit -->
		<button
			type="button"
			onclick={handleCreate}
			disabled={submitting}
			class="w-full py-3 rounded-lg font-bold text-[#e0e4f0] transition-all duration-300 cursor-pointer mt-2 bg-[var(--color-primary)] hover:brightness-110 shadow-[0_4px_14px_rgba(122,162,247,0.2)] hover:shadow-[0_6px_20px_rgba(122,162,247,0.3)] {submitting
				? 'opacity-50 cursor-not-allowed'
				: ''}"
		>
			{submitting ? "Creating..." : "Create Charity"}
		</button>

		<!-- Messages -->
		{#if error}
			<p
				class="text-[var(--color-primary)] text-sm text-center font-medium bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 rounded-lg px-4 py-2"
			>
				{error}
			</p>
		{/if}
		{#if success}
			<p
				class="text-[#9ece6a] text-sm text-center font-medium bg-[#9ece6a]/10 border border-[#9ece6a]/30 rounded-lg px-4 py-2"
			>
				{success}
			</p>
		{/if}
	</div>
</div>

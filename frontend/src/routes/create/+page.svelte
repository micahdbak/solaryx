<script>
	import { onMount } from "svelte";
	import { fetchCharities, createMarket } from "$lib/api";

	let title = $state("");
	let description = $state("");
	let type = $state("jekyll");
	let durationValue = $state(1);
	let durationUnit = $state("d");
	let charityA = $state("");
	let charityB = $state("");
	let error = $state("");
	let success = $state("");
	let submitting = $state(false);

	let charities = $state([]);

	onMount(async () => {
		try {
			charities = await fetchCharities();
		} catch (e) {
			console.error("Failed to load charities:", e);
		}
	});

	async function handleCreate() {
		error = "";
		success = "";

		if (!title.trim()) {
			error = "Title is required";
			return;
		}

		if (charities.length > 0 && (!charityA || !charityB)) {
			error = "Please select two charities";
			return;
		}

		if (charityA && charityB && charityA === charityB) {
			error = "Please select two different charities";
			return;
		}

		if (!durationValue || durationValue <= 0) {
			error = "Duration must be a positive number";
			return;
		}

		submitting = true;
		try {
			const unitToSeconds = { m: 60, h: 3600, d: 86400, w: 604800 };
			const durationSeconds = durationValue * unitToSeconds[durationUnit];

			const charity_ids = [charityA, charityB].filter(Boolean);
			const market = await createMarket({
				title: title.trim(),
				description: description.trim() || undefined,
				type: type === "hyde" ? "HYDE" : "JEKYLL",
				duration: durationSeconds,
				charity_ids
			});
			// Redirect to the newly created market
			window.location.href = `/bet/${market.id}`;
		} catch (ex) {
			error = `${ex.message || ex}`;
		} finally {
			submitting = false;
		}
	}
</script>

<div class="max-w-2xl mx-auto px-6 md:px-10 py-12">
	<h1 class="text-3xl font-extrabold text-[var(--text-primary)] mb-8 tracking-tight">
		Create Market
	</h1>

	<div class="rounded-2xl border p-8 space-y-6 bg-[var(--bg-card)] border-[var(--border-card)]">
		<!-- Title -->
		<div class="space-y-2">
			<label for="market-title" class="block text-sm font-semibold text-[var(--text-muted)]"
				>Title</label
			>
			<input
				id="market-title"
				type="text"
				placeholder="e.g. Wildlife Protection: WWF vs WCS"
				class="w-full rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
				bind:value={title}
			/>
		</div>

		<!-- Description -->
		<div class="space-y-2">
			<label for="market-desc" class="block text-sm font-semibold text-[var(--text-muted)]"
				>Description</label
			>
			<textarea
				id="market-desc"
				rows="3"
				placeholder="Describe what this market is about..."
				class="w-full rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none resize-none transition-colors bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
				bind:value={description}
			></textarea>
		</div>

		<!-- Type -->
		<div class="space-y-2">
			<label class="block text-sm font-semibold text-[var(--text-muted)]">Type</label>
			<div class="flex gap-3">
				<button
					type="button"
					onclick={() => (type = "jekyll")}
					class="flex-1 py-3 rounded-lg font-bold text-sm transition-all duration-300 cursor-pointer border {type ===
					'jekyll'
						? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[#e0e4f0] shadow-[0_0_12px_rgba(122,162,247,0.2)]'
						: 'bg-transparent border-[var(--border-card)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'}"
				>
					Jekyll
				</button>
				<button
					type="button"
					onclick={() => (type = "hyde")}
					class="flex-1 py-3 rounded-lg font-bold text-sm transition-all duration-300 cursor-pointer border {type ===
					'hyde'
						? 'bg-[#c45a5a] border-[#c45a5a] text-[#e0e4f0] shadow-[0_0_12px_rgba(196,90,90,0.2)]'
						: 'bg-transparent border-[var(--border-card)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'}"
				>
					Hyde
				</button>
			</div>
		</div>

		<!-- Time -->
		<div class="space-y-2">
			<label
				for="market-duration"
				class="block text-sm font-semibold text-[var(--text-muted)]">Time length</label
			>
			<div class="flex gap-3">
				<input
					id="market-duration"
					type="number"
					min="1"
					class="w-1/2 rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
					bind:value={durationValue}
				/>
				<select
					class="w-1/2 rounded-lg px-4 py-3 text-[var(--text-primary)] outline-none transition-colors cursor-pointer bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
					bind:value={durationUnit}
				>
					<option value="m">Minute(s)</option>
					<option value="h">Hour(s)</option>
					<option value="d">Day(s)</option>
					<option value="w">Week(s)</option>
				</select>
			</div>
		</div>

		<!-- Charities -->
		<div class="space-y-2">
			<label class="block text-sm font-semibold text-[var(--text-muted)]">Charities</label>
			{#if charities.length === 0}
				<p class="text-[var(--text-muted)] text-sm italic">
					No charities available yet. Create charities via the API first.
				</p>
			{:else}
				<div class="grid grid-cols-2 gap-3">
					<select
						class="rounded-lg px-4 py-3 text-[var(--text-primary)] outline-none transition-colors bg-[var(--bg-input)] border border-[var(--border-input)]"
						bind:value={charityA}
					>
						<option value="">Select Charity A</option>
						{#each charities as c}
							<option value={c.id}>{c.name}</option>
						{/each}
					</select>
					<select
						class="rounded-lg px-4 py-3 text-[var(--text-primary)] outline-none transition-colors bg-[var(--bg-input)] border border-[var(--border-input)]"
						bind:value={charityB}
					>
						<option value="">Select Charity B</option>
						{#each charities as c}
							<option value={c.id}>{c.name}</option>
						{/each}
					</select>
				</div>
			{/if}
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
			{submitting ? "Creating..." : "Create Market"}
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

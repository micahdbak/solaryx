<script>
    import { isEvilStore } from "$lib/theme";

    let title = $state("");
    let description = $state("");
    let type = $state("good");
    let charityA = $state("");
    let charityB = $state("");
    let duration = $state("24h");
    let error = $state("");
    let success = $state("");

    // Placeholder — will be populated from the backend later
    const charities = [];

    const durationOptions = [
        { value: "1h", label: "1 Hour" },
        { value: "6h", label: "6 Hours" },
        { value: "12h", label: "12 Hours" },
        { value: "24h", label: "24 Hours" },
        { value: "48h", label: "2 Days" },
        { value: "72h", label: "3 Days" },
        { value: "168h", label: "1 Week" },
    ];

    async function handleCreate() {
        error = "";
        success = "";

        if (!title.trim()) {
            error = "Title is required";
            return;
        }
        if (!description.trim()) {
            error = "Description is required";
            return;
        }

        // TODO: Submit to backend API
        success = "Market creation is not yet connected to the backend.";
    }
</script>

<div class="max-w-2xl mx-auto px-6 md:px-10 py-12">
    <h1 class="text-3xl font-extrabold text-white mb-8 tracking-tight">
        Create Market
    </h1>

    <div
        class="rounded-2xl border p-8 space-y-6 {$isEvilStore
            ? 'bg-[#200505] border-red-900/40'
            : 'bg-[#11141c] border-gray-800'}"
    >
        <!-- Title -->
        <div class="space-y-2">
            <label
                for="market-title"
                class="block text-sm font-semibold text-gray-300">Title</label
            >
            <input
                id="market-title"
                type="text"
                placeholder="e.g. Wildlife Protection: WWF vs WCS"
                class="w-full rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors {$isEvilStore
                    ? 'bg-[#150000] border border-red-900/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}"
                bind:value={title}
            />
        </div>

        <!-- Description -->
        <div class="space-y-2">
            <label
                for="market-desc"
                class="block text-sm font-semibold text-gray-300"
                >Description</label
            >
            <textarea
                id="market-desc"
                rows="3"
                placeholder="Describe what this market is about..."
                class="w-full rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none resize-none transition-colors {$isEvilStore
                    ? 'bg-[#150000] border border-red-900/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}"
                bind:value={description}
            ></textarea>
        </div>

        <!-- Type -->
        <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-300">Type</label
            >
            <div class="flex gap-3">
                <button
                    type="button"
                    onclick={() => (type = "good")}
                    class="flex-1 py-3 rounded-lg font-bold text-sm transition-all duration-300 cursor-pointer border {type ===
                    'good'
                        ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                        : $isEvilStore
                          ? 'bg-transparent border-red-900/40 text-gray-400 hover:border-red-700'
                          : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}"
                >
                    Good
                </button>
                <button
                    type="button"
                    onclick={() => (type = "evil")}
                    class="flex-1 py-3 rounded-lg font-bold text-sm transition-all duration-300 cursor-pointer border {type ===
                    'evil'
                        ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                        : $isEvilStore
                          ? 'bg-transparent border-red-900/40 text-gray-400 hover:border-red-700'
                          : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}"
                >
                    Evil
                </button>
            </div>
        </div>

        <!-- Charities -->
        <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-300"
                >Charities</label
            >
            {#if charities.length === 0}
                <p class="text-gray-500 text-sm italic">
                    No charities available yet. Charities will be loaded from
                    the backend.
                </p>
            {:else}
                <div class="grid grid-cols-2 gap-3">
                    <select
                        class="rounded-lg px-4 py-3 text-white outline-none transition-colors {$isEvilStore
                            ? 'bg-[#150000] border border-red-900/50'
                            : 'bg-black border border-gray-700'}"
                        bind:value={charityA}
                    >
                        <option value="">Select Charity A</option>
                        {#each charities as c}
                            <option value={c.id}>{c.name}</option>
                        {/each}
                    </select>
                    <select
                        class="rounded-lg px-4 py-3 text-white outline-none transition-colors {$isEvilStore
                            ? 'bg-[#150000] border border-red-900/50'
                            : 'bg-black border border-gray-700'}"
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

        <!-- Duration -->
        <div class="space-y-2">
            <label
                for="market-duration"
                class="block text-sm font-semibold text-gray-300"
                >Duration</label
            >
            <select
                id="market-duration"
                class="w-full rounded-lg px-4 py-3 text-white outline-none transition-colors cursor-pointer {$isEvilStore
                    ? 'bg-[#150000] border border-red-900/50 focus:border-red-500'
                    : 'bg-black border border-gray-700 focus:border-blue-500'}"
                bind:value={duration}
            >
                {#each durationOptions as opt}
                    <option value={opt.value}>{opt.label}</option>
                {/each}
            </select>
        </div>

        <!-- Submit -->
        <button
            type="button"
            onclick={handleCreate}
            class="w-full py-3 rounded-lg font-bold text-white transition-all duration-300 cursor-pointer mt-2 {$isEvilStore
                ? 'bg-red-600 hover:bg-red-700 shadow-[0_4px_14px_rgba(220,38,38,0.3)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.5)]'
                : 'bg-blue-600 hover:bg-blue-700 shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)]'}"
        >
            Create Market
        </button>

        <!-- Messages -->
        {#if error}
            <p
                class="text-red-400 text-sm text-center font-medium bg-red-950/20 border border-red-900/50 rounded-lg px-4 py-2"
            >
                {error}
            </p>
        {/if}
        {#if success}
            <p
                class="text-green-400 text-sm text-center font-medium bg-green-950/20 border border-green-900/50 rounded-lg px-4 py-2"
            >
                {success}
            </p>
        {/if}
    </div>
</div>

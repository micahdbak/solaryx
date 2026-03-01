<script>
    import {
        isEvilStore,
        searchQueryStore,
        activeTopicStore,
    } from "$lib/theme";
    import { bets } from "$lib/bets";

    let displayBets = $derived(
        bets
            .filter((b) => {
                if (b.isEvil !== $isEvilStore) return false;

                if ($searchQueryStore) {
                    const query = $searchQueryStore.toLowerCase();
                    const matchesTitle = b.title.toLowerCase().includes(query);
                    const matchesTags = b.tags?.some((tag) =>
                        tag.toLowerCase().includes(query),
                    );
                    if (!matchesTitle && !matchesTags) return false;
                }

                const topic = $activeTopicStore;
                if (
                    topic === "Trending" ||
                    topic === "New" ||
                    topic === "Expiring Soon"
                )
                    return true;

                return b.tags?.includes(topic);
            })
            .sort((a, b) => {
                if ($activeTopicStore === "Trending") {
                    const volA = parseFloat(a.vol.replace(/[^0-9.]/g, "")) || 0;
                    const volB = parseFloat(b.vol.replace(/[^0-9.]/g, "")) || 0;
                    return volB - volA;
                }
                if ($activeTopicStore === "New") {
                    const getH = (s) =>
                        s && s.includes("day") ? parseInt(s) * 24 : parseInt(s);
                    return getH(b.timeRemaining) - getH(a.timeRemaining);
                }
                if ($activeTopicStore === "Expiring Soon") {
                    const getH = (s) =>
                        s && s.includes("day") ? parseInt(s) * 24 : parseInt(s);
                    return getH(a.timeRemaining) - getH(b.timeRemaining);
                }
                return 0;
            }),
    );
</script>

<div class="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
    <div></div>

    <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
        {#each displayBets as cause}
            <a
                href="/bet/{cause.id}"
                class="bg-[#242730] hover:bg-[#2a2e38] border border-gray-700/50 hover:border-gray-600/50 transition-all rounded-xl p-4 flex flex-col group block no-underline shadow-lg {$isEvilStore
                    ? 'border-red-900/50 hover:border-red-800/80 bg-red-950/20 hover:bg-red-950/40'
                    : ''}"
            >
                <!-- Title & Header -->
                <div class="flex justify-between items-start mb-5 h-[50px]">
                    <div class="flex gap-3">
                        <img
                            src={cause.image}
                            alt="icon"
                            class="w-7 h-7 rounded-full mt-0.5 bg-black/20"
                        />
                        <h3
                            class="text-[0.90rem] font-semibold text-gray-200 leading-tight group-hover:text-white transition-colors line-clamp-3"
                        >
                            {cause.title}
                        </h3>
                    </div>
                </div>

                <div class="flex-1 flex flex-col justify-end">
                    <!-- Option Rows (Progress Bars) -->
                    <div class="flex flex-col gap-2 mb-4">
                        <div
                            class="relative overflow-hidden rounded bg-black/40 h-8 flex items-center border border-gray-800/50 {$isEvilStore
                                ? 'border-red-950/50'
                                : ''}"
                        >
                            <div
                                class="absolute inset-y-0 left-0 var-bg-optionA-medium"
                                style="width: {cause.chance}%;"
                            ></div>
                            <div
                                class="relative w-full flex justify-between items-center px-3"
                            >
                                <span
                                    class="text-sm font-bold var-color-optionA z-10 truncate max-w-[70%]"
                                    >{cause.optionA.name}</span
                                >
                                <span class="text-white text-sm font-black z-10"
                                    >{cause.chance}%</span
                                >
                            </div>
                        </div>
                        <div
                            class="relative overflow-hidden rounded bg-black/40 h-8 flex items-center border border-gray-800/50 {$isEvilStore
                                ? 'border-red-950/50'
                                : ''}"
                        >
                            <div
                                class="absolute inset-y-0 left-0 var-bg-optionB-medium"
                                style="width: {100 - cause.chance}%;"
                            ></div>
                            <div
                                class="relative w-full flex justify-between items-center px-3"
                            >
                                <span
                                    class="text-sm font-bold var-color-optionB z-10 truncate max-w-[70%]"
                                    >{cause.optionB.name}</span
                                >
                                <span class="text-white text-sm font-black z-10"
                                    >{100 - cause.chance}%</span
                                >
                            </div>
                        </div>
                    </div>

                    <!-- Single Button -->
                    <div class="mb-3">
                        <div
                            class="w-full py-2.5 rounded font-bold text-sm transition-colors text-center text-white/90 bg-white/10 group-hover:bg-white/20 {$isEvilStore
                                ? 'group-hover:bg-red-500/30 text-red-100'
                                : 'group-hover:bg-blue-500/30'}"
                        >
                            Donate to Vote
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div
                    class="flex items-center justify-between text-[0.65rem] text-gray-400 border-t border-gray-700/50 pt-2.5 mt-1 font-semibold"
                >
                    <div class="flex gap-2 items-center flex-wrap">
                        <span class="text-gray-500 flex items-center gap-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                class="var-color-optionA"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                ><circle cx="12" cy="12" r="10"
                                ></circle><polyline points="12 6 12 12 16 14"
                                ></polyline></svg
                            >
                            {cause.timeRemaining}
                        </span>
                    </div>
                    <div class="flex gap-3">
                        <!-- Gift Icon -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            class="hover:text-white transition-colors"
                            stroke="currentColor"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <rect x="3" y="8" width="18" height="4" rx="1" />
                            <path d="M12 8v13" />
                            <path
                                d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"
                            />
                            <path
                                d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"
                            />
                        </svg>
                        <!-- Bookmark Icon -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            class="hover:text-white transition-colors"
                            stroke="currentColor"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path
                                d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                            />
                        </svg>
                    </div>
                </div>
            </a>
        {/each}
    </div>
</div>

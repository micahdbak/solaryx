<script>
    import { onMount, onDestroy } from "svelte";
    import { page } from "$app/stores";
    import { isEvilStore, themeLockedStore } from "$lib/theme";
    import { bets } from "$lib/bets";

    let currentBet = $derived(
        bets.find((b) => b.id === $page.params.id) || bets[0],
    );
    let selectedCause = $state("");
    let donationAmount = $state("");

    // Initialize selectedCause once currentBet is loaded
    $effect(() => {
        if (currentBet && !selectedCause) {
            selectedCause = currentBet.optionA.name; // default to first option
        }
    });

    onMount(() => {
        // When entering the bet page, lock the theme based on the bet's properties
        if (currentBet.isEvil) {
            $isEvilStore = true;
        } else {
            $isEvilStore = false;
        }
        $themeLockedStore = true;
    });

    // We also need to react if they navigate between bets while already on a bet page
    $effect(() => {
        if (typeof document !== "undefined") {
            $isEvilStore = currentBet.isEvil;
        } // the store sync effect in layout handles the body class
    });

    onDestroy(() => {
        // Release the theme lock when leaving the page
        $themeLockedStore = false;
    });
</script>

<section
    class="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 mt-2 w-full"
>
    <!-- Left/Center Column: Market Info & Chart -->
    <div class="space-y-6">
        <!-- Market Header -->
        <div class="flex items-start justify-between">
            <div>
                <h1
                    class="text-2xl md:text-3xl font-bold tracking-tight var-text-primary"
                >
                    {currentBet.title}
                </h1>
                <div class="flex items-center gap-4 mt-3 font-semibold">
                    <span
                        class="text-4xl font-extrabold {currentBet.optionA
                            .color} var-text-israel"
                        >{currentBet.chance}% {currentBet.optionA.name}</span
                    >
                    <span
                        class="{currentBet.optionB
                            .color} var-text-palestine flex items-center text-sm font-bold {currentBet
                            .optionB
                            .bg} var-bg-palestine-light px-2 py-1 rounded"
                        >{100 - currentBet.chance}% {currentBet.optionB
                            .name}</span
                    >
                </div>
            </div>
            <div class="flex gap-2">
                <button
                    class="p-2 hover:bg-white/10 var-hover-bg rounded transition-colors text-gray-400 var-text-muted hover:text-white var-hover-text"
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
                        ><path
                            d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                        ></path><path
                            d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                        ></path></svg
                    >
                </button>
                <button
                    class="p-2 hover:bg-white/10 var-hover-bg rounded transition-colors text-gray-400 var-text-muted hover:text-white var-hover-text"
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
                        ><path
                            d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"
                        ></path></svg
                    >
                </button>
            </div>
        </div>

        <div class="flex items-center gap-6 mt-4 mb-2">
            <div
                class="flex items-baseline gap-2 text-3xl md:text-5xl font-extrabold var-color-optionA tracker-tight"
            >
                {currentBet.chance}%
                <span class="text-2xl md:text-4xl"
                    >{currentBet.optionA.name}</span
                >
            </div>

            <div
                class="flex items-baseline gap-2 text-lg md:text-xl font-bold text-gray-400"
            >
                {100 - currentBet.chance}% {currentBet.optionB.name}
            </div>
        </div>

        <!-- Chart Box -->
        <div
            class="relative h-[350px] bg-[#11141c] {$isEvilStore
                ? '!bg-[#200505] !border-[#450a0a]'
                : ''} transition-colors duration-700 rounded-xl border border-gray-800 p-4 flex flex-col group overflow-hidden"
        >
            <div class="flex justify-between items-center mb-2 z-10">
                <div class="text-xs text-gray-500 var-text-muted font-medium">
                    Vol: $34M Donated
                </div>
                <div class="flex gap-2 text-xs text-gray-500 var-text-muted">
                    <button
                        class="hover:text-white var-hover-text px-2 py-1 bg-gray-800 var-bg-muted rounded text-white var-text-primary"
                        >1H</button
                    >
                    <button
                        class="hover:text-white var-hover-text px-2 py-1 rounded"
                        >1D</button
                    >
                    <button
                        class="hover:text-white var-hover-text px-2 py-1 rounded"
                        >1W</button
                    >
                    <button
                        class="hover:text-white var-hover-text px-2 py-1 rounded"
                        >All</button
                    >
                </div>
            </div>

            <!-- Chart Area: Area representing percentage over time -->
            <div
                class="flex-1 relative w-full mt-2 rounded-lg overflow-hidden border border-gray-800/80 var-border-card"
            >
                <!-- Background Color for bottom (Israel) -->
                <div
                    class="absolute inset-0 var-bg-optionA-medium var-bg-israel-medium"
                ></div>

                <!-- SVG Area for the top half (Palestine) descending down to ~20% -->
                <svg
                    class="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <!-- Top fill area (Palestine) flat line historical representation -->
                    <path
                        d="M0,0 L100,0 L100,20 L80,22 L60,18 L40,24 L20,16 L0,20 Z"
                        fill="rgba(94, 234, 212, 0.2)"
                        class="var-fill-palestine-light"
                    />
                    <!-- Divider Line representing the fluctuating boundary -->
                    <path
                        d="M0,20 L20,16 L40,24 L60,18 L80,22 L100,20"
                        fill="none"
                        class="var-stroke-divider"
                        stroke="#e5e7eb"
                        stroke-width="1.5"
                        vector-effect="non-scaling-stroke"
                    />
                </svg>

                <!-- Hover Tooltip -->
                <div
                    class="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-white var-bg-tooltip text-black var-text-tooltip p-2 rounded text-xs font-bold shadow-xl shadow-white/10 var-shadow-tooltip pointer-events-none -translate-x-1/2 -translate-y-full"
                    style="top: {100 - currentBet.chance}%; left: 80%;"
                >
                    <div>Current Ratio</div>
                    <div class="flex flex-col gap-1 mt-1">
                        <span class="var-color-optionA var-text-israel"
                            >{currentBet.optionA.name}: {currentBet.chance}%</span
                        >
                        <span
                            class="{currentBet.optionB
                                .color} var-text-palestine"
                            >{currentBet.optionB.name}: {100 -
                                currentBet.chance}%</span
                        >
                    </div>
                </div>
            </div>

            <!-- Axis Labels -->
            <div
                class="flex justify-between text-xs text-gray-500 var-text-muted mt-2 z-10"
            >
                <span>Jan 1</span>
                <span>Feb 1</span>
                <span>Mar 1</span>
                <span>Today</span>
            </div>
        </div>

        <!-- Leaderboard -->
        <div
            class="bg-[#11141c] {$isEvilStore
                ? '!bg-[#200505] !border-[#450a0a]'
                : ''} transition-colors duration-700 rounded-xl border border-gray-800 overflow-visible text-sm mt-4"
        >
            <table class="w-full text-left">
                <thead
                    class="text-gray-500 var-text-muted border-b border-gray-800 var-border-card"
                >
                    <tr>
                        <th class="py-3 px-4 font-medium w-12">#</th>
                        <th class="py-3 px-4 font-medium">Donor</th>
                        <th class="py-3 px-4 font-medium">Supported</th>
                        <th class="py-3 px-4 font-medium text-right">Amount</th>
                    </tr>
                </thead>
                <tbody
                    class="divide-y divide-gray-800/60 var-divide-card font-medium"
                >
                    <tr
                        class="hover:bg-white/5 var-hover-bg transition-colors cursor-pointer"
                    >
                        <td class="py-3 px-4 text-gray-600 var-text-muted">1</td
                        >
                        <td class="py-3 px-4 flex items-center gap-2">
                            <img
                                src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Curse"
                                class="w-6 h-6 rounded bg-gray-800 var-bg-muted"
                                alt="avatar"
                            />
                            <span class="text-gray-200 var-text-primary"
                                >Curseaaaaaa</span
                            >
                        </td>
                        <td class="py-3 px-4"
                            ><span
                                class="var-color-optionA var-text-israel var-bg-optionA-light var-bg-israel-light px-2 py-0.5 rounded text-xs border var-border-optionA/30 var-border-israel"
                                >Israel Aid</span
                            ></td
                        >
                        <td
                            class="py-3 px-4 text-right text-white var-text-primary"
                            >$739K</td
                        >
                    </tr>
                    <tr
                        class="hover:bg-white/5 var-hover-bg transition-colors cursor-pointer"
                    >
                        <td class="py-3 px-4 text-gray-600 var-text-muted">2</td
                        >
                        <td class="py-3 px-4 flex items-center gap-2">
                            <img
                                src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Risk"
                                class="w-6 h-6 rounded bg-gray-800 var-bg-muted"
                                alt="avatar"
                            />
                            <span class="text-gray-200 var-text-primary"
                                >TheQuietRisk</span
                            >
                        </td>
                        <td class="py-3 px-4"
                            ><span
                                class="var-color-optionA var-text-israel var-bg-optionA-light var-bg-israel-light px-2 py-0.5 rounded text-xs border var-border-optionA/30 var-border-israel"
                                >Israel Aid</span
                            ></td
                        >
                        <td
                            class="py-3 px-4 text-right text-white var-text-primary"
                            >$473K</td
                        >
                    </tr>
                    <tr
                        class="hover:bg-white/5 var-hover-bg transition-colors cursor-pointer"
                    >
                        <td class="py-3 px-4 text-gray-600 var-text-muted">3</td
                        >
                        <td class="py-3 px-4 flex items-center gap-2">
                            <img
                                src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Mag"
                                class="w-6 h-6 rounded bg-gray-800 var-bg-muted"
                                alt="avatar"
                            />
                            <span class="text-gray-200 var-text-primary"
                                >Magamyman</span
                            >
                        </td>
                        <td class="py-3 px-4"
                            ><span
                                class="var-color-optionB var-text-palestine var-bg-optionB-light var-bg-palestine-light px-2 py-0.5 rounded text-xs border var-border-optionB/30 var-border-palestine"
                                >Palestine Relief</span
                            ></td
                        >
                        <td
                            class="py-3 px-4 text-right text-white var-text-primary"
                            >$120K</td
                        >
                    </tr>
                    <tr
                        class="hover:bg-white/5 var-hover-bg transition-colors cursor-pointer"
                    >
                        <td class="py-3 px-4 text-gray-600 var-text-muted">4</td
                        >
                        <td class="py-3 px-4 flex items-center gap-2">
                            <img
                                src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Tom"
                                class="w-6 h-6 rounded bg-gray-800 var-bg-muted"
                                alt="avatar"
                            />
                            <span class="text-gray-200 var-text-primary"
                                >Thomas58</span
                            >
                        </td>
                        <td class="py-3 px-4"
                            ><span
                                class="var-color-optionA var-text-israel var-bg-optionA-light var-bg-israel-light px-2 py-0.5 rounded text-xs border var-border-optionA/30 var-border-israel"
                                >Israel Aid</span
                            ></td
                        >
                        <td
                            class="py-3 px-4 text-right text-white var-text-primary"
                            >$112K</td
                        >
                    </tr>
                    <tr
                        class="hover:bg-white/5 var-hover-bg transition-colors cursor-pointer"
                    >
                        <td class="py-3 px-4 text-gray-600 var-text-muted">5</td
                        >
                        <td class="py-3 px-4 flex items-center gap-2">
                            <img
                                src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Arb"
                                class="w-6 h-6 rounded bg-gray-800 var-bg-muted"
                                alt="avatar"
                            />
                            <span class="text-gray-200 var-text-primary"
                                >Arbguy</span
                            >
                        </td>
                        <td class="py-3 px-4"
                            ><span
                                class="var-color-optionB var-text-palestine var-bg-optionB-light var-bg-palestine-light px-2 py-0.5 rounded text-xs border var-border-optionB/30 var-border-palestine"
                                >Palestine Relief</span
                            ></td
                        >
                        <td
                            class="py-3 px-4 text-right text-white var-text-primary"
                            >$103K</td
                        >
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Right Column: Donation Panel -->
    <div class="space-y-6">
        <div
            class="bg-[#11141c] {$isEvilStore
                ? '!bg-[#200505] !border-[#450a0a]'
                : ''} transition-colors duration-700 border border-gray-800 rounded-2xl p-6 sticky top-24 shadow-2xl"
        >
            <!-- Action Header with Timer -->
            <div
                class="flex items-center justify-between mb-4 pb-4 border-b border-gray-800/80 var-border-card"
            >
                <h2 class="text-xl font-bold text-white var-text-primary">
                    Make an Impact
                </h2>
                <div class="flex items-center gap-2">
                    <span
                        class="text-xs text-gray-400 var-text-muted font-bold uppercase tracking-wider"
                        >Ends In:</span
                    >
                    <div
                        class="text-sm font-mono text-gray-300 var-text-primary font-bold bg-gray-800/50 var-bg-muted px-2 py-1 rounded"
                    >
                        12:47:37
                    </div>
                </div>
            </div>

            <!-- Choose Cause -->
            <div class="grid grid-cols-2 gap-3 mb-6">
                <button
                    class="py-4 flex flex-col items-center justify-center rounded-xl border-2 font-bold cursor-pointer transition-colors
                    {selectedCause === currentBet.optionA.name
                        ? `border-current $var-bg-optionA-light $var-color-optionA shadow-[0_0_10px_currentColor]`
                        : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200'}"
                    onclick={() => (selectedCause = currentBet.optionA.name)}
                >
                    <span>{currentBet.optionA.name}</span>
                </button>
                <button
                    class="py-4 flex flex-col items-center justify-center rounded-xl border-2 font-bold cursor-pointer transition-colors
                    {selectedCause === currentBet.optionB.name
                        ? `border-current $var-bg-optionB-light $var-color-optionB shadow-[0_0_10px_currentColor]`
                        : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200'}"
                    onclick={() => (selectedCause = currentBet.optionB.name)}
                >
                    <span>{currentBet.optionB.name}</span>
                </button>
            </div>

            <div class="space-y-3 relative group">
                <div
                    class="flex justify-between items-center text-sm font-medium"
                >
                    <span
                        class="text-gray-400 var-text-muted group-focus-within:text-white group-focus-within:var-text-primary transition-colors"
                        >Donation Amount</span
                    >
                    <span
                        class="text-gray-500 var-text-muted hover:text-white hover:var-text-primary cursor-pointer transition-colors"
                        onclick={() => (donationAmount = 0)}
                        >Balance: $0.00</span
                    >
                </div>

                <div class="relative">
                    <span
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 var-text-muted text-xl pointer-events-none group-focus-within:text-white group-focus-within:var-text-primary transition-colors"
                        >$</span
                    >
                    <input
                        type="number"
                        min="0"
                        placeholder="0"
                        bind:value={donationAmount}
                        class="w-full bg-black var-bg-input border border-gray-700 var-border-input rounded-xl py-4 pl-10 pr-4 text-right text-2xl font-bold text-white var-text-primary focus:outline-none focus:border-white focus:var-border-primary focus:ring-1 focus:ring-white focus:var-ring-primary transition-all caret-white var-caret-primary no-spinners"
                    />
                </div>

                <div class="flex gap-2 text-xs font-semibold">
                    <button
                        class="flex-1 py-2 bg-gray-800/80 var-bg-muted hover:bg-gray-700 hover:var-bg-card rounded-lg text-gray-300 var-text-primary transition-colors cursor-pointer"
                        onclick={() => (donationAmount += 1)}>+$1</button
                    >
                    <button
                        class="flex-1 py-2 bg-gray-800/80 var-bg-muted hover:bg-gray-700 hover:var-bg-card rounded-lg text-gray-300 var-text-primary transition-colors cursor-pointer"
                        onclick={() => (donationAmount += 5)}>+$5</button
                    >
                    <button
                        class="flex-1 py-2 bg-gray-800/80 var-bg-muted hover:bg-gray-700 hover:var-bg-card rounded-lg text-gray-300 var-text-primary transition-colors cursor-pointer"
                        onclick={() => (donationAmount += 10)}>+$10</button
                    >
                    <button
                        class="flex-1 py-2 bg-gray-800/80 var-bg-muted hover:bg-gray-700 hover:var-bg-card rounded-lg text-gray-300 var-text-primary transition-colors cursor-pointer"
                        onclick={() => (donationAmount += 100)}>+$100</button
                    >
                    <button
                        class="flex-1 py-2 bg-gray-800/80 var-bg-muted hover:bg-gray-700 hover:var-bg-card rounded-lg text-gray-300 var-text-primary transition-colors cursor-pointer"
                        onclick={() => (donationAmount = 1000)}>Max</button
                    >
                </div>
            </div>

            <div class="mt-8 space-y-4">
                <button
                    class="w-full py-4 bg-white var-bg-primary hover:bg-gray-200 hover:var-bg-primary-hover text-black var-text-invert font-extrabold text-lg rounded-xl shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] var-shadow-primary hover:shadow-[0_6px_20px_0_rgba(255,255,255,0.2)] hover:var-shadow-primary-hover active:scale-[0.98] transition-all cursor-pointer tracking-wide"
                >
                    Donate {donationAmount ? `$${donationAmount}` : "Now"}
                </button>
            </div>
        </div>
    </div>
</section>

import { writable } from "svelte/store";

export const isHydeStore = writable(false);
export const themeLockedStore = writable(false);
export const searchQueryStore = writable("");
export const activeTopicStore = writable("Trending");
export const selectedCurrencyStore = writable("SOL");
export const exchangeRatesStore = writable({ usd: 0, cad: 0, eur: 0 });

import { writable } from "svelte/store";

export const isEvilStore = writable(false);
export const themeLockedStore = writable(false);
export const searchQueryStore = writable("");
export const activeTopicStore = writable("Trending");

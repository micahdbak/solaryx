export function formatSol(amount) {
	const num = Number(amount);
	if (isNaN(num)) return "0";
	return new Intl.NumberFormat("en-US", { maximumFractionDigits: 9 }).format(num);
}

/**
 * Format a countdown from an endsAt timestamp.
 * Returns a human-friendly string like "2h 14m 5s" or "Ended".
 */
export function formatTimeRemaining(endsAt) {
	const remaining = endsAt - Date.now();
	if (remaining <= 0) return "Ended";
	const h = Math.floor(remaining / 3600000);
	const m = Math.floor((remaining % 3600000) / 60000);
	const s = Math.floor((remaining % 60000) / 1000);
	if (h > 0) return `${h}h ${m}m ${s}s`;
	if (m > 0) return `${m}m ${s}s`;
	return `${s}s`;
}

/**
 * Currency conversion helpers.
 * Pass the store values directly as arguments to keep this module store-free.
 */
export function getCurrencySymbol(curr) {
	if (curr === "USD" || curr === "CAD") return "$";
	if (curr === "EUR") return "€";
	return "";
}

export function getCurrencyLabel(curr) {
	return curr;
}

export function convertSol(sol, curr, rates) {
	if (curr === "USD") return `$${(sol * rates.usd).toFixed(2)} USD`;
	if (curr === "CAD") return `$${(sol * rates.cad).toFixed(2)} CAD`;
	if (curr === "EUR") return `€${(sol * rates.eur).toFixed(2)} EUR`;
	return `${formatSol(sol)} SOL`;
}

/**
 * Shared market filter + sort logic used by both the home page and my-bets.
 * @param {Array} markets - formatted market objects
 * @param {object} opts - { isHyde, searchQuery, activeTopic, excludeEnded }
 */
export function filterAndSortMarkets(
	markets,
	{ isHyde, searchQuery, activeTopic, excludeEnded = false }
) {
	return markets
		.filter((b) => {
			if (b.isHyde !== isHyde) return false;
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				if (!b.title.toLowerCase().includes(query)) return false;
			}
			if (excludeEnded && b.endsAt < Date.now()) return false;
			return true;
		})
		.sort((a, b) => {
			if (activeTopic === "Trending" || activeTopic === "Breaking") {
				return b.totalSol - a.totalSol;
			}
			if (activeTopic === "New") {
				return b.createdAt - a.createdAt;
			}
			if (activeTopic === "Expiring Soon") {
				return a.endsAt - b.endsAt;
			}
			return b.createdAt - a.createdAt;
		});
}

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

/**
 * Generate axis labels for the chart based on the selected timeframe.
 * @param {string} selectedTimeframe - e.g., "1H", "1D", "1W", "All"
 * @param {object} currentBet - The current market object containing createdAt
 * @returns {Array<string>} The generated axis labels
 */
export function getAxisLabels(selectedTimeframe, currentBet) {
	const now = new Date();
	const labels = [];
	const count = 4;

	if (selectedTimeframe === "1H") {
		for (let i = 0; i < count; i++) {
			const d = new Date(now.getTime() - (count - 1 - i) * 15 * 60 * 1000);
			labels.push(
				d.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit"
				})
			);
		}
	} else if (selectedTimeframe === "1D") {
		for (let i = 0; i < count; i++) {
			const d = new Date(now.getTime() - (count - 1 - i) * 6 * 60 * 60 * 1000);
			labels.push(
				d.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit"
				})
			);
		}
	} else if (selectedTimeframe === "1W") {
		for (let i = 0; i < count; i++) {
			const d = new Date(now.getTime() - (count - 1 - i) * 2 * 24 * 60 * 60 * 1000);
			labels.push(
				d.toLocaleDateString([], {
					month: "short",
					day: "numeric"
				})
			);
		}
	} else {
		if (!currentBet) return ["", "", "", "Now"];
		const start = currentBet.createdAt;
		const range = now.getTime() - start;
		for (let i = 0; i < count; i++) {
			const d = new Date(start + (i / (count - 1)) * range);
			labels.push(
				d.toLocaleDateString([], {
					month: "short",
					day: "numeric"
				})
			);
		}
	}
	return labels;
}

/**
 * Shared handleDonation logic for components like TrendingHeader and Individual Market page.
 * @param {object} params
 * @param {object} params.currentBet - The active market
 * @param {string} params.selectedCause - The cause name the user selected to donate to
 * @param {number|string} params.donationAmount - The amount in SOL to donate
 * @param {function} params.createShare - The API function to create a new share
 * @param {function} params.onSuccess - Callback triggered after a successful donation
 * @param {function} params.onError - Callback triggered when donation fails (e.g. alert)
 */
export async function handleDonation({
	currentBet,
	selectedCause,
	donationAmount,
	createShare,
	onSuccess,
	onError
}) {
	if (!donationAmount || donationAmount <= 0) return;

	if (currentBet.endsAt < Date.now()) {
		if (onError) onError("This market has ended. Donations are no longer accepted.");
		return;
	}

	const charityId =
		selectedCause === currentBet.optionA.name
			? currentBet.optionA.market_charity_id
			: currentBet.optionB.market_charity_id;

	try {
		await createShare(currentBet.id, {
			market_charity_id: charityId,
			amount_sol: donationAmount
		});
		if (onSuccess) await onSuccess();
	} catch (e) {
		console.error("Donation failed:", e);
		if (onError) onError(e.message || "Donation failed");
	}
}

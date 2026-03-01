// ─── Raw API helpers ────────────────────────────────────────────

export async function fetchConfig() {
	const res = await fetch("/api/config");
	if (!res.ok) throw new Error("Failed to fetch config");
	return res.json();
}

export async function fetchBlockhash() {
	const res = await fetch("/api/solana/blockhash");
	if (!res.ok) throw new Error("Failed to fetch blockhash");
	return res.json();
}

export async function fetchMarkets() {
	const res = await fetch("/api/markets");
	if (!res.ok) throw new Error("Failed to fetch markets");
	return res.json();
}

export async function fetchMyBets() {
	const res = await fetch("/api/my-bets", { credentials: "include" });
	if (!res.ok) throw new Error("Failed to fetch my bets");
	return res.json();
}

export async function fetchMarket(id) {
	const res = await fetch(`/api/markets/${id}`);
	if (!res.ok) throw new Error("Failed to fetch market");
	return res.json();
}

export async function fetchCharities() {
	const res = await fetch("/api/charities");
	if (!res.ok) throw new Error("Failed to fetch charities");
	return res.json();
}

export async function fetchShares(marketId) {
	const res = await fetch(`/api/markets/${marketId}/shares`);
	if (!res.ok) throw new Error("Failed to fetch shares");
	return res.json();
}

export async function fetchWalletBalance() {
	const res = await fetch("/api/wallet/balance", { credentials: "include" });
	if (!res.ok) throw new Error("Failed to fetch wallet balance");
	return res.json();
}

export async function depositWallet(data) {
	const res = await fetch("/api/wallet/deposit", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(data)
	});
	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.error || "Failed to deposit");
	}
	return res.json();
}

export async function fetchDeposits() {
	const res = await fetch("/api/wallet/deposits", { credentials: "include" });
	if (!res.ok) throw new Error("Failed to fetch deposits");
	return res.json();
}

export async function createMarket(data) {
	const res = await fetch("/api/markets", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(data)
	});
	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.error || "Failed to create market");
	}
	return res.json();
}

export async function createShare(marketId, data) {
	const res = await fetch(`/api/markets/${marketId}/shares`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(data)
	});
	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.error || "Failed to create share");
	}
	return res.json();
}

export async function createCharity(data) {
	const res = await fetch("/api/charities", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	});
	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.error || "Failed to create charity");
	}
	return res.json();
}

// ─── Display-shape transformer ──────────────────────────────────

/**
 * Convert a backend market object + charities lookup into the display shape
 * that existing templates expect.
 */
export function formatMarket(market, charitiesById) {
	const charityTotals = Array.isArray(market.charity_totals) ? market.charity_totals : [];

	const totalSol = Number(market.total_sol) || 0;

	// Build optionA / optionB from the first two linked charities
	const a = charityTotals[0];
	const b = charityTotals[1];

	const aCharity = a ? charitiesById[a.charity_id] : null;
	const bCharity = b ? charitiesById[b.charity_id] : null;

	const aName = aCharity?.name ?? "Option A";
	const bName = bCharity?.name ?? "Option B";

	const aSol = a ? Number(a.total_sol) || 0 : 0;
	const bSol = b ? Number(b.total_sol) || 0 : 0;
	const sumSol = aSol + bSol;
	const chance = sumSol > 0 ? Math.round((aSol / sumSol) * 100) : 0;

	// Time remaining from created_at + time_length_s
	const createdAt = new Date(market.created_at).getTime();
	const endsAt = createdAt + Number(market.time_length_s) * 1000;
	const remaining = endsAt - Date.now();
	let timeRemaining;
	if (remaining <= 0) {
		timeRemaining = "Ended";
	} else if (remaining < 3600_000) {
		timeRemaining = `${Math.ceil(remaining / 60_000)} min left`;
	} else if (remaining < 86400_000) {
		timeRemaining = `${Math.ceil(remaining / 3600_000)} hours left`;
	} else {
		timeRemaining = `${Math.ceil(remaining / 86400_000)} days left`;
	}

	return {
		id: market.id,
		isHyde: market.type === "HYDE",
		title: market.title,
		description: market.description || "",
		image: market.image_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${market.id}`,
		chance,
		optionA: { name: aName, market_charity_id: a?.market_charity_id ?? "", charity: aCharity },
		optionB: { name: bName, market_charity_id: b?.market_charity_id ?? "", charity: bCharity },
		vol: totalSol > 0 ? `${totalSol.toFixed(2)} SOL` : "0 SOL",
		totalSol,
		timeRemaining,
		createdAt,
		endsAt,
		charityTotals
	};
}

/** Build a { [id]: Charity } lookup from an array */
export function indexCharities(charities) {
	const map = {};
	for (const c of charities) map[c.id] = c;
	return map;
}

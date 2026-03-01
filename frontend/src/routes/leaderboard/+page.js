export async function load({ fetch }) {
	// Let's create mock data initially in case server is down,
	// but try to fetch if possible.
	let topUsers = [];
	let biggestWins = [];

	try {
		const [usersRes, winsRes] = await Promise.all([
			fetch("/api/leaderboard?timeframe=monthly"),
			fetch("/api/leaderboard/wins")
		]);

		if (usersRes.ok) {
			topUsers = await usersRes.json();
		}
		if (winsRes.ok) {
			biggestWins = await winsRes.json();
		}
	} catch (err) {
		console.error("Failed to load initial leaderboard data", err);
	}

	return {
		topUsers,
		biggestWins
	};
}

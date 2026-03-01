const express = require("express");
const crypto = require("crypto");
const { verify_session } = require("./auth");
const pool = require("./db");
const { Market, ErrorResponse, StatusResponse } = require("./models");
const { sendToCharity } = require("./solana");

const router = express.Router();

// Create a market
router.post("/markets", verify_session, async (req, res) => {
	const { title, description, image_url, type, charity_ids, duration } = req.body;

	if (!title || !type) {
		return res.status(400).json(new ErrorResponse("title and type are required"));
	}

	if (!["JEKYLL", "HYDE"].includes(type)) {
		return res.status(400).json(new ErrorResponse("type must be JEKYLL or HYDE"));
	}

	// Support flexible durations
	let time_length_s = Number(duration);
	if (isNaN(time_length_s) || time_length_s <= 0) {
		const durationMap = { "1m": 60, "1h": 3600, "1d": 86400, "1w": 604800 };
		time_length_s = durationMap[String(duration)] || 86400;
	}

	const client = await pool.connect();
	try {
		await client.query("BEGIN");

		const marketResult = await client.query(
			`INSERT INTO markets (title, description, image_url, type, status, time_length_s)
			 VALUES ($1, $2, $3, $4, 'ACTIVE', $5)
			 RETURNING *`,
			[title, description || null, image_url || null, type, time_length_s]
		);
		const market = marketResult.rows[0];

		if (charity_ids && charity_ids.length > 0) {
			const values = charity_ids.map((_, i) => `($1, $${i + 2})`).join(", ");
			const params = [market.id, ...charity_ids];
			await client.query(
				`INSERT INTO market_charity (market_id, charity_id) VALUES ${values}`,
				params
			);
		}

		await client.query("COMMIT");
		res.status(201).json(new Market(market));
	} catch (err) {
		await client.query("ROLLBACK");
		console.error("Error creating market:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	} finally {
		client.release();
	}
});

// Get all markets (with aggregated pot data)
router.get("/markets", async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT m.*,
			        COALESCE(s.total_sol, 0) AS total_sol,
			        COALESCE(mc_agg.charities, '[]') AS charity_totals
			 FROM markets m
			 LEFT JOIN (
			     SELECT market_id, SUM(amount_sol) AS total_sol
			     FROM shares
			     GROUP BY market_id
			 ) s ON s.market_id = m.id
			 LEFT JOIN LATERAL (
			     SELECT json_agg(json_build_object(
			         'market_charity_id', mc.id,
			         'charity_id', mc.charity_id,
			         'total_sol', COALESCE(cs.total_sol, 0)
			     )) AS charities
			     FROM market_charity mc
			     LEFT JOIN (
			         SELECT market_charity_id, SUM(amount_sol) AS total_sol
			         FROM shares
			         GROUP BY market_charity_id
			     ) cs ON cs.market_charity_id = mc.id
			     WHERE mc.market_id = m.id
			 ) mc_agg ON true
			 ORDER BY m.created_at DESC`
		);
		res.json(result.rows.map((row) => new Market(row)));
	} catch (err) {
		console.error("Error fetching markets:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

// Get a single market by id (with aggregated pot data)
router.get("/markets/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const result = await pool.query(
			`SELECT m.*,
			        COALESCE(s.total_sol, 0) AS total_sol,
			        COALESCE(mc_agg.charities, '[]') AS charity_totals
			 FROM markets m
			 LEFT JOIN (
			     SELECT market_id, SUM(amount_sol) AS total_sol
			     FROM shares
			     GROUP BY market_id
			 ) s ON s.market_id = m.id
			 LEFT JOIN LATERAL (
			     SELECT json_agg(json_build_object(
			         'market_charity_id', mc.id,
			         'charity_id', mc.charity_id,
			         'total_sol', COALESCE(cs.total_sol, 0)
			     )) AS charities
			     FROM market_charity mc
			     LEFT JOIN (
			         SELECT market_charity_id, SUM(amount_sol) AS total_sol
			         FROM shares
			         GROUP BY market_charity_id
			     ) cs ON cs.market_charity_id = mc.id
			     WHERE mc.market_id = m.id
			 ) mc_agg ON true
			 WHERE m.id = $1`,
			[id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json(new ErrorResponse("Market not found"));
		}

		const marketRow = result.rows[0];

		if (!marketRow.winning_share) {
			const createdAt = new Date(marketRow.created_at).getTime();
			const timeLengthMs = parseFloat(marketRow.time_length_s) * 1000;

			if (Date.now() >= createdAt + timeLengthMs) {
				const client = await pool.connect();
				let winningShareId = null;
				let totalSol = 0;

				// Phase 1: select & commit winner (stops the retry loop)
				try {
					await client.query("BEGIN");

					const { rows: lockRows } = await client.query(
						"SELECT winning_share FROM markets WHERE id = $1 FOR UPDATE",
						[marketRow.id]
					);

					if (lockRows.length > 0 && lockRows[0].winning_share === null) {
						const { rows: shares } = await client.query(
							"SELECT id, amount_sol FROM shares WHERE market_id = $1",
							[marketRow.id]
						);

						if (shares.length > 0) {
							totalSol = shares.reduce((acc, s) => acc + parseFloat(s.amount_sol), 0);

							if (totalSol > 0) {
								for (let i = shares.length - 1; i > 0; i--) {
									const j = crypto.randomInt(0, i + 1);
									[shares[i], shares[j]] = [shares[j], shares[i]];
								}
								const r = (crypto.randomBytes(4).readUInt32LE(0) / 0x100000000) * totalSol;
								let cumulative = 0;
								winningShareId = shares[shares.length - 1].id;
								for (const share of shares) {
									cumulative += parseFloat(share.amount_sol);
									if (cumulative > r) { winningShareId = share.id; break; }
								}

								await client.query(
									"UPDATE markets SET winning_share = $1, status = 'COMPLETE' WHERE id = $2",
									[winningShareId, marketRow.id]
								);
								marketRow.winning_share = winningShareId;
								marketRow.status = "COMPLETE";
							}
						}
					} else if (lockRows[0]?.winning_share) {
						// Another request already committed a winner between our outer check and the lock
						winningShareId = lockRows[0].winning_share;
					}

					await client.query("COMMIT");
				} catch (phase1Err) {
					await client.query("ROLLBACK");
					console.error("Market resolution error (phase 1):", phase1Err);
				} finally {
					client.release();
				}

				// Phase 2: on-chain payout (separate — failure won't re-randomise winner)
				if (winningShareId && totalSol > 0 && !marketRow.payout_tx) {
					try {
						const { rows: charityRows } = await pool.query(
							`SELECT c.id, c.name, c.wallet_address
							 FROM shares s
							 JOIN market_charity mc ON mc.id = s.market_charity_id
							 JOIN charities c ON c.id = mc.charity_id
							 WHERE s.id = $1`,
							[winningShareId]
						);

						const charity = charityRows[0];
						if (charity?.wallet_address) {
							const signature = await sendToCharity(charity.wallet_address, totalSol);
							await pool.query(
								"UPDATE markets SET payout_tx = $1 WHERE id = $2",
								[signature, marketRow.id]
							);
							await pool.query(
								`INSERT INTO payouts (market_id, charity_id, amount_sol, transaction_signature) VALUES ($1, $2, $3, $4)`,
								[marketRow.id, charity.id, totalSol, signature]
							);
							marketRow.payout_tx = signature;
						} else {
							console.warn(`Market resolution: charity "${charity?.name}" has no wallet_address`);
						}
					} catch (phase2Err) {
						console.error("Market resolution error (phase 2 payout):", phase2Err);
					}
				}
			}
		}

		res.json(new Market(marketRow));
	} catch (err) {
		console.error("Error fetching market:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

// Get markets the logged-in user has participated in
router.get("/my-bets", verify_session, async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT m.*,
			        COALESCE(s.total_sol, 0) AS total_sol,
			        COALESCE(mc_agg.charities, '[]') AS charity_totals
			 FROM markets m
			 LEFT JOIN (
			     SELECT market_id, SUM(amount_sol) AS total_sol
			     FROM shares
			     GROUP BY market_id
			 ) s ON s.market_id = m.id
			 LEFT JOIN LATERAL (
			     SELECT json_agg(json_build_object(
			         'market_charity_id', mc.id,
			         'charity_id', mc.charity_id,
			         'total_sol', COALESCE(cs.total_sol, 0)
			     )) AS charities
			     FROM market_charity mc
			     LEFT JOIN (
			         SELECT market_charity_id, SUM(amount_sol) AS total_sol
			         FROM shares
			         GROUP BY market_charity_id
			     ) cs ON cs.market_charity_id = mc.id
			     WHERE mc.market_id = m.id
			 ) mc_agg ON true
			 WHERE EXISTS (
			     SELECT 1 FROM shares sh
			     WHERE sh.market_id = m.id AND sh.user_id = $1
			 )
			 ORDER BY m.created_at DESC`,
			[req.user.id]
		);
		res.json(result.rows.map((row) => new Market(row)));
	} catch (err) {
		console.error("Error fetching my bets:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

// Mark all of a user's shares in a market as seen
router.post("/markets/:id/seen", verify_session, async (req, res) => {
	const market_id = req.params.id;
	const user_id = req.user.id;
	try {
		await pool.query(
			`UPDATE shares SET seen_result = TRUE WHERE market_id = $1 AND user_id = $2`,
			[market_id, user_id]
		);
		res.json(new StatusResponse(true));
	} catch (err) {
		console.error("Error marking market shares as seen:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

module.exports = router;

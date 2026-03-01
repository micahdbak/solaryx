const express = require("express");
const { verify_session } = require("./auth");
const pool = require("./db");
const { createWallet } = require("./solana");
const { Market, ErrorResponse } = require("./models");

const router = express.Router();

// Create a market
router.post("/markets", verify_session, async (req, res) => {
	const { title, description, image_url, type, charity_ids } = req.body;

	if (!title || !type) {
		return res.status(400).json(new ErrorResponse("title and type are required"));
	}

	if (!["JEKYLL", "HYDE"].includes(type)) {
		return res.status(400).json(new ErrorResponse("type must be JEKYLL or HYDE"));
	}

	const client = await pool.connect();
	try {
		await client.query("BEGIN");

		const wallet = createWallet();
		const marketResult = await client.query(
			`INSERT INTO markets (title, description, image_url, type, status, time_length_s, wallet_address)
			 VALUES ($1, $2, $3, $4, 'ACTIVE', 3600, $5)
			 RETURNING *`,
			[title, description || null, image_url || null, type, wallet.publicKey]
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
			     WHERE transaction_status = 'FINALIZED'
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
			         WHERE transaction_status = 'FINALIZED'
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
			     WHERE transaction_status = 'FINALIZED'
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
			         WHERE transaction_status = 'FINALIZED'
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
							const totalSol = shares.reduce((acc, s) => acc + parseFloat(s.amount_sol), 0);
							if (totalSol > 0) {
								const crypto = require("crypto");

								// 1. Randomize the array of shares
								shares.sort(() => {
									const randomFraction = crypto.randomBytes(4).readUInt32LE(0) / 0xffffffff;
									return randomFraction - 0.5;
								});

								// Default fallback if probability misses all somehow (e.g. precision bounds)
								let winningShareId = shares[shares.length - 1].id;

								// 2. Iterate each, rolling the dice with probability = amount_sol / total_sol
								for (const share of shares) {
									const probability = parseFloat(share.amount_sol) / totalSol;
									const randomFraction = crypto.randomBytes(4).readUInt32LE(0) / 0xffffffff;

									if (randomFraction <= probability) {
										winningShareId = share.id;
										break;
									}
								}

								await client.query(
									"UPDATE markets SET winning_share = $1 WHERE id = $2",
									[winningShareId, marketRow.id]
								);
								marketRow.winning_share = winningShareId;
							}
						}
					}

					await client.query("COMMIT");
				} catch (innerErr) {
					await client.query("ROLLBACK");
					console.error("Error setting winning share:", innerErr);
				} finally {
					client.release();
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
			     WHERE transaction_status = 'FINALIZED'
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
			         WHERE transaction_status = 'FINALIZED'
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
		res.json(result.rows);
	} catch (err) {
		console.error("Error fetching my bets:", err);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;

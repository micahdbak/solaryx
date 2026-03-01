const express = require("express");
const pool = require("./db");
const { verify_session } = require("./auth");
const { Share, ErrorResponse } = require("./models");

const router = express.Router();

// Create a share
router.post("/markets/:id/shares", verify_session, async (req, res) => {
	const market_id = req.params.id;
	const { market_charity_id, amount_sol } = req.body;
	const user_id = req.user.id;

	if (!market_charity_id || !amount_sol) {
		return res
			.status(400)
			.json(new ErrorResponse("market_charity_id and amount_sol are required"));
	}

	const finalAmount = parseFloat(amount_sol);
	if (isNaN(finalAmount) || finalAmount <= 0) {
		return res.status(400).json(new ErrorResponse("Invalid amount"));
	}

	const client = await pool.connect();
	try {
		await client.query("BEGIN");

		// Verify the market is still active and not expired
		const marketResult = await client.query(
			"SELECT status, created_at, time_length_s FROM markets WHERE id = $1 FOR UPDATE",
			[market_id]
		);

		if (marketResult.rows.length === 0) {
			await client.query("ROLLBACK");
			return res.status(404).json(new ErrorResponse("Market not found"));
		}

		const market = marketResult.rows[0];
		const createdAt = new Date(market.created_at).getTime();
		const timeLengthMs = parseFloat(market.time_length_s) * 1000;
		const isExpired = Date.now() >= createdAt + timeLengthMs;

		if (market.status !== "ACTIVE" || isExpired) {
			await client.query("ROLLBACK");
			return res.status(400).json(new ErrorResponse("Market is no longer active"));
		}

		// Deduct user balance securely
		const balanceResult = await client.query(
			"UPDATE users SET balance_sol = balance_sol - $1 WHERE id = $2 AND balance_sol >= $1 RETURNING balance_sol",
			[finalAmount, user_id]
		);

		if (balanceResult.rows.length === 0) {
			await client.query("ROLLBACK");
			return res.status(400).json(new ErrorResponse("Insufficient balance"));
		}

		const result = await client.query(
			`INSERT INTO shares (user_id, market_id, market_charity_id, amount_sol)
			 VALUES ($1, $2, $3, $4)
			 RETURNING *`,
			[user_id, market_id, market_charity_id, finalAmount]
		);

		await client.query("COMMIT");
		res.status(201).json(new Share(result.rows[0]));
	} catch (err) {
		await client.query("ROLLBACK");
		console.error("Error creating share:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	} finally {
		client.release();
	}
});

// Get all shares for a market
router.get("/markets/:id/shares", async (req, res) => {
	const market_id = req.params.id;

	try {
		const result = await pool.query(
			`SELECT * FROM shares WHERE market_id = $1 ORDER BY created_at ASC`,
			[market_id]
		);
		res.json(result.rows.map((row) => new Share(row)));
	} catch (err) {
		console.error("Error fetching shares:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

module.exports = router;

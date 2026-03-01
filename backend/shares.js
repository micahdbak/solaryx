const express = require("express");
const pool = require("./db");
const { verify_session } = require("./auth");
const { checkTransaction } = require("./solana");
const { Share, ErrorResponse } = require("./models");

const router = express.Router();

// Create a share
router.post("/markets/:id/shares", verify_session, async (req, res) => {
	const market_id = req.params.id;
	const { market_charity_id, amount_sol } = req.body;
	const user_id = req.user.id;

	if (!market_charity_id || !amount_sol) {
		return res.status(400).json({
			error: "market_charity_id and amount_sol are required"
		});
	}

	try {
		const finalAmount = parseFloat(amount_sol);
		if (isNaN(finalAmount) || finalAmount <= 0) {
			return res.status(400).json({ error: "Invalid amount" });
		}

		await pool.query("BEGIN");

		// Deduct user balance securely
		const balanceResult = await pool.query(
			"UPDATE users SET balance_sol = balance_sol - $1 WHERE id = $2 AND balance_sol >= $1 RETURNING balance_sol",
			[finalAmount, user_id]
		);

		if (balanceResult.rows.length === 0) {
			await pool.query("ROLLBACK");
			return res.status(400).json({ error: "Insufficient balance" });
		}

		const result = await pool.query(
			`INSERT INTO shares (user_id, market_id, market_charity_id, amount_sol)
			 VALUES ($1, $2, $3, $4)
			 RETURNING *`,
			[user_id, market_id, market_charity_id, finalAmount]
		);

		await pool.query("COMMIT");
		res.status(201).json(result.rows[0]);
	} catch (err) {
		await pool.query("ROLLBACK");
		console.error("Error creating share:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
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

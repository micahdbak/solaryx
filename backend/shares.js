const express = require("express");
const pool = require("./db");
const { verify_session } = require("./auth");
const { checkTransaction } = require("./solana");

const router = express.Router();

// Create a share
router.post("/markets/:id/shares", verify_session, async (req, res) => {
	const market_id = req.params.id;
	const { market_charity_id, transaction_signature, amount_sol } = req.body;
	const user_id = req.user.id;

	if (!market_charity_id || !transaction_signature) {
		return res.status(400).json({
			error: "market_charity_id and transaction_signature are required"
		});
	}

	try {
		const tx = await checkTransaction(transaction_signature);
		const finalAmount = amount_sol ? parseFloat(amount_sol) : tx.amount;

		const result = await pool.query(
			`INSERT INTO shares (user_id, market_id, market_charity_id, amount_sol, transaction_signature, transaction_status)
			 VALUES ($1, $2, $3, $4, $5, $6)
			 RETURNING *`,
			[
				user_id,
				market_id,
				market_charity_id,
				finalAmount,
				transaction_signature,
				tx.status === "finalized" ? "FINALIZED" : "WAITING"
			]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error("Error creating share:", err);
		res.status(500).json({ error: "Internal server error" });
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
		res.json(result.rows);
	} catch (err) {
		console.error("Error fetching shares:", err);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;

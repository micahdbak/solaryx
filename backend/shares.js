const express = require("express");
const pool = require("./db");
const { verify_session } = require("./auth");
const { checkTransaction } = require("./solana");

const router = express.Router();

// Create a share
router.post("/shares", verify_session, async (req, res) => {
	const { market_id, market_charity_id, transaction_signature } = req.body;
	const user_id = req.user.id;

	if (!market_id || !market_charity_id || !transaction_signature) {
		return res.status(400).json({
			error: "market_id, market_charity_id, and transaction_signature are required"
		});
	}

	try {
		// Fetch the market to get the developer wallet address
		const marketRes = await pool.query("SELECT wallet_address FROM markets WHERE id = $1", [
			market_id
		]);
		if (marketRes.rows.length === 0) {
			return res.status(404).json({ error: "Market not found" });
		}
		const expectedWallet = marketRes.rows[0].wallet_address;

		const tx = await checkTransaction(transaction_signature, expectedWallet);

		const result = await pool.query(
			`INSERT INTO shares (user_id, market_id, market_charity_id, amount_sol, transaction_signature, transaction_status)
			 VALUES ($1, $2, $3, $4, $5, $6)
			 RETURNING *`,
			[
				user_id,
				market_id,
				market_charity_id,
				tx.amount,
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

module.exports = router;

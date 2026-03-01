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
		const tx = await checkTransaction(transaction_signature);

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

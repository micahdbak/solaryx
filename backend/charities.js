const express = require("express");
const { verify_session } = require("./auth");
const pool = require("./db");
const router = express.Router();

// Create a charity
router.post("/charities", verify_session, async (req, res) => {
	const { name, description, logo_url, solana_wallet_address, type } = req.body;
	try {
		const result = await pool.query(
			"INSERT INTO charities (name, description, logo_url, solana_wallet_address, type) VALUES ($1, $2, $3, $4, $5) RETURNING *",
			[name, description, logo_url, solana_wallet_address, type || "good"]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error("Error creating charity:", err);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get all charities
router.get("/charities", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM charities ORDER BY created_at DESC");
		res.json(result.rows);
	} catch (err) {
		console.error("Error fetching charities:", err);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get charities by type
router.get("/charities/type/:type", async (req, res) => {
	const { type } = req.params;
	if (type !== "good" && type !== "evil") {
		return res.status(400).json({ error: "Type must be 'good' or 'evil'" });
	}
	try {
		const result = await pool.query(
			"SELECT * FROM charities WHERE type = $1 ORDER BY created_at DESC",
			[type]
		);
		res.json(result.rows);
	} catch (err) {
		console.error("Error fetching charities by type:", err);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get a single charity by id
router.get("/charities/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const result = await pool.query("SELECT * FROM charities WHERE id = $1", [id]);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Charity not found" });
		}
		res.json(result.rows[0]);
	} catch (err) {
		console.error("Error fetching charity:", err);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;

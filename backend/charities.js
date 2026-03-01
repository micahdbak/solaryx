const express = require("express");
const { verify_session } = require("./auth");
const pool = require("./db");
const { Charity, ErrorResponse } = require("./models");
const router = express.Router();

// Create a charity
router.post("/charities", verify_session, async (req, res) => {
	const { name, description, link, logo_url, wallet_address } = req.body;
	if (!name) {
		return res.status(400).json(new ErrorResponse("name is required"));
	}
	try {
		const result = await pool.query(
			"INSERT INTO charities (name, description, link, logo_url, wallet_address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
			[name, description || null, link || null, logo_url || null, wallet_address || null]
		);
		res.status(201).json(new Charity(result.rows[0]));
	} catch (err) {
		console.error("Error creating charity:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

// Get all charities
router.get("/charities", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM charities ORDER BY created_at DESC");
		res.json(result.rows.map((row) => new Charity(row)));
	} catch (err) {
		console.error("Error fetching charities:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

// Get a single charity by id
router.get("/charities/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const result = await pool.query("SELECT * FROM charities WHERE id = $1", [id]);
		if (result.rows.length === 0) {
			return res.status(404).json(new ErrorResponse("Charity not found"));
		}
		res.json(new Charity(result.rows[0]));
	} catch (err) {
		console.error("Error fetching charity:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

module.exports = router;

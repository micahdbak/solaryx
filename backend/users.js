const express = require("express");
const pool = require("./db");
const { verify_session } = require("./auth");
const {
	ErrorResponse,
	ProfileResponse,
	ProfileUpdateResponse,
	SearchUserResponse,
	UsernameAvailableResponse,
	BalanceResponse,
	Deposit,
	DepositResponse
} = require("./models");

const router = express.Router();

// Get public user profile (no auth required), gets avatar, username, and user stats (shares)
// Example usage: GET /profile/123e4567-e89b-12d3-a456-426614174000
router.get("/profile/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const profileResult = await pool.query(
			"SELECT user_id, username, avatar_url FROM profiles WHERE user_id = $1",
			[id]
		);

		if (profileResult.rows.length === 0) {
			return res.status(404).json(new ErrorResponse("Profile not found"));
		}

		const profile = profileResult.rows[0];

		// Get user shares
		const sharesResult = await pool.query(
			"SELECT * FROM shares WHERE user_id = $1 ORDER BY created_at DESC",
			[profile.user_id]
		);

		res.json(new ProfileResponse(profile.username, profile.avatar_url, sharesResult.rows));
	} catch (err) {
		console.error("Error fetching profile:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

// Update user profile (requires auth)
// Example usage:
// PUT /profile/123e4567-e89b-12d3-a456-426614174000
// Headers: { "Cookie": "token=your_jwt_here" }
// Body: { "username": "new_name", "avatar_url": "https://example.com/avatar.png" }
router.put("/profile/:id", verify_session, async (req, res) => {
	const { id } = req.params;
	const { username, avatar_url } = req.body;

	// Ensure the logged-in user is updating their own profile
	if (req.user.id !== id) {
		return res
			.status(403)
			.json(new ErrorResponse("Forbidden: You can only update your own profile"));
	}

	try {
		// Update the profile, using COALESCE to only update provided fields
		const updateResult = await pool.query(
			`UPDATE profiles 
             SET username = COALESCE($1, username), 
                 avatar_url = COALESCE($2, avatar_url)
             WHERE user_id = $3
             RETURNING username, avatar_url`,
			[username, avatar_url, id]
		);

		if (updateResult.rows.length === 0) {
			return res.status(404).json(new ErrorResponse("Profile not found"));
		}

		res.json(new ProfileUpdateResponse("Profile updated successfully", updateResult.rows[0]));
	} catch (err) {
		console.error("Error updating profile:", err);
		if (err.code === "23505") {
			// PostgreSQL unique violation error code
			return res.status(400).json(new ErrorResponse("Username already taken"));
		}
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

// Search users by username
// Example usage: GET /search/users?q=Tra&limit=5
router.get("/search/users", async (req, res) => {
	const { q, limit } = req.query;

	if (!q) {
		return res.status(400).json(new ErrorResponse("Search query 'q' is required"));
	}

	const searchLimit = parseInt(limit) || 10;
	// Use ILIKE for case-insensitive search
	const searchQuery = `%${q}%`;

	try {
		const result = await pool.query(
			"SELECT user_id, username, avatar_url FROM profiles WHERE username ILIKE $1 LIMIT $2",
			[searchQuery, searchLimit]
		);

		res.json(result.rows.map((r) => new SearchUserResponse(r)));
	} catch (err) {
		console.error("Error searching users:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

// Check username availability
// Example usage: GET /username-available?username=Tra
router.get("/username-available", async (req, res) => {
	const { username } = req.query;

	if (!username) {
		return res.status(400).json(new ErrorResponse("Username query parameter is required"));
	}

	try {
		const result = await pool.query("SELECT 1 FROM profiles WHERE username ILIKE $1 LIMIT 1", [
			username
		]);

		res.json(new UsernameAvailableResponse(result.rows.length === 0));
	} catch (err) {
		console.error("Error checking username availability:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

// Get current user's wallet balance
router.get("/wallet/balance", verify_session, async (req, res) => {
	try {
		const result = await pool.query("SELECT balance_sol FROM users WHERE id = $1", [
			req.user.id
		]);
		if (result.rows.length === 0)
			return res.status(404).json(new ErrorResponse("User not found"));
		res.json(new BalanceResponse(parseFloat(result.rows[0].balance_sol)));
	} catch (err) {
		console.error("Error fetching balance:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

// Deposit SOL into wallet via on-chain transaction
router.post("/wallet/deposit", verify_session, async (req, res) => {
	const { transaction_signature } = req.body;
	if (!transaction_signature) {
		return res.status(400).json(new ErrorResponse("Missing transaction_signature"));
	}

	try {
		// Idempotency check: guard against replay attacks
		const existingDeposit = await pool.query(
			"SELECT id FROM deposits WHERE transaction_signature = $1",
			[transaction_signature]
		);
		if (existingDeposit.rows.length > 0) {
			return res.status(400).json(new ErrorResponse("Deposit already processed"));
		}

		// Verify on blockchain
		const { checkTransaction } = require("./solana");
		const tx = await checkTransaction(transaction_signature);

		if (!tx || tx.status !== "finalized") {
			return res.status(400).json(new ErrorResponse("Transaction not finalized"));
		}

		const client = await pool.connect();
		try {
			await client.query("BEGIN");

			// Record the deposit
			await client.query(
				"INSERT INTO deposits (user_id, amount_sol, transaction_signature) VALUES ($1, $2, $3)",
				[req.user.id, tx.amount, transaction_signature]
			);

			await client.query("COMMIT");

			res.json(new DepositResponse("Deposit successful", tx.amount));
		} catch (innerErr) {
			await client.query("ROLLBACK");
			throw innerErr;
		} finally {
			client.release();
		}
	} catch (err) {
		console.error("Deposit error:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

router.post("/wallet/coupon/:code", verify_session, async (req, res) => {
	const code = req.params.code;

	const client = await pool.connect();
	try {
		const result = await client.query("SELECT * FROM coupons WHERE code = $1", [code]);
		if (result.rows.length === 0)
			return res.status(404).json(new ErrorResponse("Coupon not found"));

		let transaction_signature = `${req.user.id}-coupon-${code}`;

		// ensure coupon hasn't been used before by this user
		const existingDeposit = await client.query(
			"SELECT id FROM deposits WHERE transaction_signature = $1",
			[transaction_signature]
		);
		if (existingDeposit.rows.length > 0) {
			return res.status(400).json(new ErrorResponse("Coupon already processed"));
		}

		const coupon = result.rows[0];

		// check that coupon hasn't been fully used
		if (coupon.num_uses >= coupon.max_uses) {
			return res.status(400).json(new ErrorResponse("Coupon fully used"));
		}

		await client.query("BEGIN");

		// Record the deposit
		await client.query(
			"INSERT INTO deposits (user_id, amount_sol, transaction_signature) VALUES ($1, $2, $3)",
			[req.user.id, coupon.amount_sol, transaction_signature]
		);

		// Update the coupon
		await client.query("UPDATE coupons SET num_uses = $1 WHERE id = $2", [
			coupon.num_uses + 1,
			coupon.id
		]);

		await client.query("COMMIT");

		res.json(new DepositResponse("Deposit successful", coupon.amount_sol));
	} catch (ex) {
		console.error("Coupon error:", ex);
		await client.query("ROLLBACK");
		res.status(500).json(new ErrorResponse("Internal server error"));
	} finally {
		client.release();
	}
});

// Get user's deposit history
router.get("/wallet/deposits", verify_session, async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM deposits WHERE user_id = $1 ORDER BY created_at DESC",
			[req.user.id]
		);
		res.json(result.rows.map((r) => new Deposit(r)));
	} catch (err) {
		console.error("Error fetching deposits:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

module.exports = router;

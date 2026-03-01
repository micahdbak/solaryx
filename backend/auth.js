const express = require("express");
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-123";

const router = express.Router();

// str
async function hash_password(password) {
	if (!password) {
		throw new Error("Password must be provided");
	}

	try {
		const hash = await bcrypt.hash(password, 10);
		return hash;
	} catch (error) {
		console.error("Error hashing password:", error);
		throw error;
	}
}

// bool
async function verify_password(password, hash) {
	if (!password || !hash) {
		return false;
	}

	try {
		const match = await bcrypt.compare(password, hash);
		return match;
	} catch (error) {
		console.error("Error verifying password:", error);
		return false;
	}
}

// bool
function is_valid_password(password) {
	// a-Z, A-Z, 0-9, special chars, must be >=4 chars and <=32
	return /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{4,32}$/.test(password);
}

// helper function; returns user info from db
async function verify_session_token(token) {
	if (!token) return null;
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const result = await pool.query("SELECT * FROM users WHERE email = $1", [decoded.email]);
		if (result.rows.length === 0) return null;

		return result.rows[0];
	} catch {
		return null;
	}
}

// USE THIS WITH router.get/.post/.anything; router.get("/route", verify_session, ...)
async function verify_session(req, res, next) {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const user = await verify_session_token(token);

	if (!user) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	req.user = { id: user.id, email: user.email };
	next();
}

router.post("/signup", async (req, res) => {
	/* User will submit a JSON body to the request with fields:
	 * - "email": email to sign up with
	 * - "password": password to sign up with
	 * - "username": chosen display name
	 */
	const { email, password, username } = req.body;
	if (!email || !password || !username) {
		return res.status(400).json({ error: "Email, password, and username are required" });
	}

	if (!is_valid_password(password)) {
		return res.status(400).json({ error: "Invalid password" });
	}

	// Double-check username is not taken before hashing
	const usernameCheck = await pool.query("SELECT 1 FROM profiles WHERE username ILIKE $1", [
		username
	]);
	if (usernameCheck.rows.length > 0) {
		return res.status(400).json({ error: "Username already taken" });
	}

	const hash = await hash_password(password);
	const client = await pool.connect();

	try {
		await client.query("BEGIN");

		const result = await client.query(
			"INSERT INTO users(email, password_hash) VALUES ($1, $2) RETURNING id, email",
			[email, hash]
		);
		const user = result.rows[0];

		await client.query("INSERT INTO profiles(user_id, username) VALUES ($1, $2)", [
			user.id,
			username
		]);

		await client.query("COMMIT");
		return res.status(200).json({ status: true });
	} catch (ex) {
		await client.query("ROLLBACK");
		console.error(ex);
		return res.status(400).json({ error: "Email or username already exists" });
	} finally {
		client.release();
	}
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ error: "Email and password are required" });
	}

	try {
		const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
		if (result.rows.length === 0) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const user = result.rows[0];
		const match = await verify_password(password, user.password_hash);
		if (!match) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// issue token and set in cookie
		const token = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, {
			expiresIn: "24h"
		});
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "prod",
			sameSite: "strict",
			maxAge: 24 * 60 * 60 * 1000 // 24 hours
		});

		res.json({
			message: "User logged in successfully",
			user: { id: user.id, email: user.email }
		});
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.post("/logout", (req, res) => {
	// Clear the JWT cookie
	res.clearCookie("token");
	res.json({ message: "User logged out" });
});

router.get("/status", verify_session, (req, res) => {
	res.json({ status: true, user: req.user });
});

module.exports = router;
module.exports.verify_session = verify_session;

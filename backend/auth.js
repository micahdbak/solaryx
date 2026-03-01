const express = require("express");
const pool = require("./db");
// const send_email = require("./ses");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, StatusResponse, LoginResponse, ErrorResponse } = require("./models");

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-123";
// const API_URL = process.env.API_URL || "http://localhost:5173/api";

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
		return res.status(401).json(new ErrorResponse("Unauthorized"));
	}

	const user = await verify_session_token(token);

	if (!user) {
		return res.status(401).json(new ErrorResponse("Unauthorized"));
	}

	req.user = {
		id: user.id,
		email: user.email,
		balance_sol: user.balance_sol ? parseFloat(user.balance_sol) : 0
	};
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
		return res
			.status(400)
			.json(new ErrorResponse("Email, password, and username are required"));
	}

	if (!is_valid_password(password)) {
		return res.status(400).json(new ErrorResponse("Invalid password"));
	}

	// Double-check username is not taken before hashing
	const usernameCheck = await pool.query("SELECT 1 FROM profiles WHERE username ILIKE $1", [
		username
	]);
	if (usernameCheck.rows.length > 0) {
		return res.status(400).json(new ErrorResponse("Username already taken"));
	}

	const hash = await hash_password(password);
	const client = await pool.connect();

	let user;

	try {
		await client.query("BEGIN");

		// future: "INSERT INTO users(email, password_hash) VALUES ($1, $2) RETURNING id, email",
		const result = await client.query(
			"INSERT INTO users(email, is_email_verified, password_hash) VALUES ($1, 't', $2) RETURNING id, email",
			[email, hash]
		);

		if (result.rows.length === 0) {
			return res.status(401).json(new ErrorResponse("Unauthorized"));
		}

		user = result.rows[0];

		await client.query("INSERT INTO profiles(user_id, username) VALUES ($1, $2)", [
			user.id,
			username
		]);

		await client.query("COMMIT");
	} catch (ex) {
		await client.query("ROLLBACK");
		console.error(ex);
		return res.status(400).json(new ErrorResponse("Email or username already exists"));
	}

	client.release();

	// try {
	// 	const verify_url = API_URL + "/auth/verify_email/" + user.id;
	// 	const emailResult = await send_email(
	// 		email,
	// 		"Verify your email",
	// 		`Verify your email for solaryx.app at ${verify_url}.`,
	// 		`<h1>Verify your email</h1>\n<p>Verify your email for <b>solaryx.app</b> at <a href="${verify_url}">${verify_url}</a></p>.`
	// 	);
	//
	// 	if (!emailResult) {
	// 		throw new Error("Email service failed to send");
	// 	}
	// } catch (ex) {
	// 	console.error("Verification email failed:", ex);
	// 	try {
	// 		// Delete profile first to satisfy foreign key constraint, then user
	// 		await pool.query("DELETE FROM profiles WHERE user_id = $1", [user.id]);
	// 		await pool.query("DELETE FROM users WHERE id = $1", [user.id]);
	// 	} catch (cleanupEx) {
	// 		console.error("Failed to clean up user after email error:", cleanupEx);
	// 	}
	// 	return res
	// 		.status(500)
	// 		.json(new ErrorResponse("Failed to send verification email. Please try again."));
	// }

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

	return res.json(new LoginResponse("User signed up successfully", new User(user)));
});

router.get("/verify_email/:id", async (req, res) => {
	const user_id = req.params.id;

	try {
		await pool.query("UPDATE users SET is_email_verified = 't' WHERE id = $1", [user_id]);
	} catch {
		return res.status(401).json(new ErrorResponse("Unauthorized"));
	}

	// redirect user to login page
	return res.redirect("/login?status=verified");
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json(new ErrorResponse("Email and password are required"));
	}

	try {
		const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
		if (result.rows.length === 0) {
			return res.status(401).json(new ErrorResponse("Unauthorized"));
		}

		const user = result.rows[0];
		const match = await verify_password(password, user.password_hash);
		if (!match) {
			return res.status(401).json(new ErrorResponse("Unauthorized"));
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

		res.json(new LoginResponse("User logged in successfully", user));
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

router.post("/logout", (req, res) => {
	// Clear the JWT cookie
	res.clearCookie("token");
	res.json(new StatusResponse(true));
});

router.get("/status", verify_session, (req, res) => {
	res.json(new StatusResponse(true, req.user));
});

module.exports = router;
module.exports.verify_session = verify_session;

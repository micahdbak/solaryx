const express = require("express");
const pool = require("./db");
const { ErrorResponse } = require("./models");

const router = express.Router();

// Helper to get date string for postgres based on timeframe
const getStartDateFromTimeframe = (timeframe) => {
	switch (timeframe) {
		case "today":
			return "NOW() - INTERVAL '1 day'";
		case "weekly":
			return "NOW() - INTERVAL '7 days'";
		case "monthly":
			return "NOW() - INTERVAL '1 month'";
		case "all":
		default:
			return "TO_TIMESTAMP(0)"; // Beginning of time
	}
};

// Get leaderboard of top users by total donated
router.get("/api/leaderboard", async (req, res) => {
	const timeframe = req.query.timeframe || "monthly";
	let intervalStr;
	switch (timeframe) {
		case "today":
			intervalStr = "1 day";
			break;
		case "weekly":
			intervalStr = "7 days";
			break;
		case "monthly":
			intervalStr = "1 month";
			break;
		case "all":
		default:
			intervalStr = "100 years"; // big enough
			break;
	}

	try {
		const result = await pool.query(
			`
			SELECT 
				u.id as user_id, 
				p.username, 
				p.avatar_url, 
				COALESCE(SUM(s.amount_sol), 0) as total_donated
			FROM users u
			LEFT JOIN profiles p ON u.id = p.user_id
			LEFT JOIN shares s ON u.id = s.user_id AND s.created_at >= NOW() - CAST($1 AS INTERVAL)
			GROUP BY u.id, p.username, p.avatar_url
			HAVING COALESCE(SUM(s.amount_sol), 0) > 0
			ORDER BY total_donated DESC
			LIMIT 100
			`,
			[intervalStr]
		);

		res.json(result.rows);
	} catch (err) {
		console.error("Error fetching leaderboard:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

// Get biggest wins of the month
router.get("/api/leaderboard/wins", async (req, res) => {
	try {
		const result = await pool.query(
			`
			SELECT 
				s.id as share_id,
				s.amount_sol,
				s.created_at,
				p.username,
				p.avatar_url,
				m.title as market_title
			FROM shares s
			JOIN profiles p ON s.user_id = p.user_id
			JOIN markets m ON s.market_id = m.id
			WHERE s.created_at >= NOW() - INTERVAL '1 month'
			ORDER BY s.amount_sol DESC
			LIMIT 20
			`
		);

		res.json(result.rows);
	} catch (err) {
		console.error("Error fetching biggest wins:", err);
		res.status(500).json(new ErrorResponse("Internal server error"));
	}
});

module.exports = router;

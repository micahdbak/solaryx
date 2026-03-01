require("dotenv").config();
const express = require("express");
const auth = require("./auth");
const charities = require("./charities");
const markets = require("./markets");
const shares = require("./shares");
const users = require("./users");
const leaderboard = require("./leaderboard");
const { StatusResponse } = require("./models");

const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/auth", auth);
app.use(charities);
app.use(shares);
app.use(users);
app.use(markets);
app.use(leaderboard);

app.get("/config", (_, res) => {
	const { GLOBAL_POOL_WALLET } = require("./solana");
	res.json({ pool_wallet_address: GLOBAL_POOL_WALLET });
});

app.get("/solana/blockhash", async (_, res) => {
	try {
		const { connection } = require("./solana");
		const { blockhash } = await connection.getLatestBlockhash();
		res.json({ blockhash });
	} catch (err) {
		console.error("Error fetching blockhash:", err);
		res.status(500).json({ error: "Failed to fetch blockhash" });
	}
});

app.get("/", (_, res) => {
	res.json(new StatusResponse(true));
});

if (require.main === module) {
	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
}

module.exports = app;

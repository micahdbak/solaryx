require("dotenv").config();
const express = require("express");
const auth = require("./auth");
const charities = require("./charities");
const markets = require("./markets");
const shares = require("./shares");
const users = require("./users");

const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/auth", auth);
app.use(charities);
app.use(markets);
app.use(shares);
app.use(users);

app.get("/", (_, res) => {
	res.json({ status: true });
});

app.get("/test", (_, res) => {
	res.json("hello");
});

if (require.main === module) {
	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
}

module.exports = app;

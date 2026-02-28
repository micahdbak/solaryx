const express = require("express");
const auth = require("./auth");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/auth", auth);

app.get("/", (_, res) => {
	res.json({ status: true });
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

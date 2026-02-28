const express = require("express");
//const pool = require("./db");

const router = express.Router();

router.post("/login", (req, res) => {
	res.json({ message: "User logged in successfully" });
});

router.post("/logout", (req, res) => {
	res.json({ message: "User logged out" });
});

router.get("/status", (req, res) => {
	res.json({ isAuthenticated: true, user: { id: 1, name: "Micah" } });
});

module.exports = router;

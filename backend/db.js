const { Pool } = require("pg");
const pool = new Pool({
	database: "sorbet"
});

module.exports = pool;

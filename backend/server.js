const express = require('express');
const app = express();
const { Pool } = require('pg');
const pool = new Pool({
  database: 'sorbet'
});
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, backend world!');
});

app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query("SELECT 'hello' as message");
    res.send(result.rows[0].message);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

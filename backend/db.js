require('dotenv').config();
console.log('Environment Variables:', {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
});
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.connect()
  .then(() => console.log('Connected to the database successfully!'))
  .catch((err) => console.error('Database connection error:', err.stack));

module.exports = pool;

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET /api/racers
app.get('/api/racers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Racer');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/classes
app.get('/api/classes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM CarClass');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/seasons
app.get('/api/seasons', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Season');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
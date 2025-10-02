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
const PORT = process.env.PORT || 5050;

// Middleware to log incoming requests for debugging
app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url, req.headers);
    next();
  });

app.use(cors());
app.use(express.json());

// Simple health check endpoint
app.get("/ping", (req, res) => res.send("pong"));


// GET /api/racers
app.get('/api/racers', async (req, res) => {
  console.log('Received request for /api/racers'); // Debugging log
  try {
    const result = await pool.query('SELECT * FROM Racer');
    console.log('Database query successful. Fetched racers:', result.rows); // Debugging log
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching racers:', err);
    res.status(500).send('Server error');
  }
});

// POST /api/racers
app.post('/api/racers', async (req, res) => {
  const { steam_name, ac_name, rank } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Racer (steam_name, ac_name, rank) VALUES ($1, $2, $3) RETURNING *',
      [steam_name, ac_name, rank]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/racers/:id
app.put('/api/racers/:id', async (req, res) => {
  const { id } = req.params;
  const { steam_name, ac_name, rank } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Racer SET steam_name = $1, ac_name = $2, rank = $3 WHERE racer_id = $4 RETURNING *',
      [steam_name, ac_name, rank, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Racer not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /api/racers/:id
app.delete('/api/racers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Racer WHERE racer_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Racer not found');
    }
    res.json({ message: 'Racer deleted successfully' });
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

// POST /api/classes
app.post('/api/classes', async (req, res) => {
  const { class_name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO CarClass (class_name) VALUES ($1) RETURNING *',
      [class_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/classes/:id
app.put('/api/classes/:id', async (req, res) => {
  const { id } = req.params;
  const { class_name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE CarClass SET class_name = $1 WHERE class_id = $2 RETURNING *',
      [class_name, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Class not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /api/classes/:id
app.delete('/api/classes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM CarClass WHERE class_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Class not found');
    }
    res.json({ message: 'Class deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/cars
app.get('/api/cars', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Car');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching cars:', err);
    res.status(500).send('Server error');
  }
});

// POST /api/cars
app.post('/api/cars', async (req, res) => {
  const { class_id, car_name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Car (class_id, car_name) VALUES ($1, $2) RETURNING *',
      [class_id, car_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/cars/:id
app.put('/api/cars/:id', async (req, res) => {
  const { id } = req.params;
  const { class_id, car_name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Car SET class_id = $1, car_name = $2 WHERE car_id = $3 RETURNING *',
      [class_id, car_name, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Car not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /api/cars/:id
app.delete('/api/cars/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Car WHERE car_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Car not found');
    }
    res.json({ message: 'Car deleted successfully' });
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

// POST /api/seasons
app.post('/api/seasons', async (req, res) => {
  const { name, start_date, end_date, drop_lowest_count } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Season (name, start_date, end_date, drop_lowest_count) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, start_date, end_date, drop_lowest_count]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/seasons/:id
app.put('/api/seasons/:id', async (req, res) => {
  const { id } = req.params;
  const { name, start_date, end_date, drop_lowest_count } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Season SET name = $1, start_date = $2, end_date = $3, drop_lowest_count = $4 WHERE season_id = $5 RETURNING *',
      [name, start_date, end_date, drop_lowest_count, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Season not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /api/seasons/:id
app.delete('/api/seasons/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Season WHERE season_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Season not found');
    }
    res.json({ message: 'Season deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/season-participation
app.post('/api/season-participation', async (req, res) => {
  const { racer_id, season_id, class_id } = req.body;
  try {
    // Ensure the racer is not already registered for the season
    const existing = await pool.query(
      'SELECT * FROM SeasonParticipation WHERE racer_id = $1 AND season_id = $2',
      [racer_id, season_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).send('Racer is already registered for this season');
    }

    // Register the racer for the season and class
    const result = await pool.query(
      'INSERT INTO SeasonParticipation (racer_id, season_id, class_id) VALUES ($1, $2, $3) RETURNING *',
      [racer_id, season_id, class_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/season-participation/:id
app.put('/api/season-participation/:id', async (req, res) => {
  const { id } = req.params;
  const { class_id } = req.body;
  try {
    // Ensure the new class is valid
    const participation = await pool.query(
      'SELECT * FROM SeasonParticipation WHERE participation_id = $1',
      [id]
    );
    if (participation.rows.length === 0) {
      return res.status(404).send('Participation record not found');
    }

    // Update the class for the racer in the season
    const result = await pool.query(
      'UPDATE SeasonParticipation SET class_id = $1 WHERE participation_id = $2 RETURNING *',
      [class_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/season-participation?season_id=123
app.get('/api/season-participation', async (req, res) => {
  const { season_id } = req.query;
  if (!season_id) return res.status(400).send('season_id is required');
  try {
    const q = `
      SELECT sp.participation_id, sp.racer_id, sp.season_id, sp.class_id,
             r.steam_name, r.ac_name, cl.class_name
      FROM SeasonParticipation sp
      JOIN Racer r   ON sp.racer_id = r.racer_id
      JOIN CarClass cl ON sp.class_id = cl.class_id
      WHERE sp.season_id = $1
      ORDER BY r.steam_name ASC
    `;
    const result = await pool.query(q, [season_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching season participation:', err);
    res.status(500).send('Server error');
  }
});

// Validation: Ensure car belongs to the class for the season
async function validateCarClass(car_id, class_id) {
  const car = await pool.query('SELECT * FROM Car WHERE car_id = $1 AND class_id = $2', [car_id, class_id]);
  return car.rows.length > 0;
}

// POST /api/race-results
app.post('/api/race-results', async (req, res) => {
  const { race_id, participation_id, car_id, position, points, fastest_lap } = req.body;
  try {
    // Validate car belongs to the class for the season
    const participation = await pool.query('SELECT * FROM SeasonParticipation WHERE participation_id = $1', [participation_id]);
    if (participation.rows.length === 0) {
      return res.status(400).send('Invalid participation record');
    }

    const class_id = participation.rows[0].class_id;
    const isValidCar = await validateCarClass(car_id, class_id);
    if (!isValidCar) {
      return res.status(400).send('Car does not belong to the class for the season');
    }

    // Ensure no duplicate results for the same racer in a race
    const existing = await pool.query(
      'SELECT * FROM RaceResult WHERE race_id = $1 AND participation_id = $2',
      [race_id, participation_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).send('Duplicate result for the same racer in this race');
    }

    // Insert race result
    const result = await pool.query(
      'INSERT INTO RaceResult (race_id, participation_id, car_id, position, points, fastest_lap) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [race_id, participation_id, car_id, position, points, fastest_lap]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/race-results/:race_id
app.get('/api/race-results/:race_id', async (req, res) => {
  const { race_id } = req.params;
  console.log(`Fetching race results for race_id: ${race_id}`);
  try {
    const query = `
      SELECT
        rr.result_id,
        rr.race_id,
        rr.participation_id,
        rr.car_id,
        rr.position,
        rr.points,
        rr.fastest_lap,
        rr.created_at,
        -- racer
        r.racer_id,
        r.steam_name AS racer_name,
        r.ac_name   AS racer_ac_name,
        r.rank      AS racer_rank,
        -- car & class
        c.car_name,
        c.class_id,
        cl.class_name,
        -- race meta
        ra.track_name   AS race_track_name,
        ra.race_date    AS race_date,
        ra.is_double_points
      FROM RaceResult rr
      JOIN SeasonParticipation sp ON rr.participation_id = sp.participation_id
      JOIN Racer r               ON sp.racer_id = r.racer_id
      JOIN Car c                 ON rr.car_id = c.car_id
      JOIN CarClass cl           ON c.class_id = cl.class_id
      JOIN Race ra               ON rr.race_id = ra.race_id
      WHERE rr.race_id = $1
    `;
    const result = await pool.query(query, [race_id]);
    console.log('Fetched race results count:', result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching race results:', err);
    res.status(500).send('Server error');
  }
});

// PUT /api/race-results/:id
app.put('/api/race-results/:id', async (req, res) => {
  const { id } = req.params;
  const { car_id, position, points, fastest_lap } = req.body;
  try {
    const result = await pool.query(
      'UPDATE RaceResult SET car_id = $1, position = $2, points = $3, fastest_lap = $4 WHERE result_id = $5 RETURNING *',
      [car_id, position, points, fastest_lap, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Race result not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /api/race-results/:id
app.delete('/api/race-results/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM RaceResult WHERE result_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Race result not found');
    }
    res.json({ message: 'Race result deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/races/:season_id
app.get('/api/races/:season_id', async (req, res) => {
  const { season_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Race WHERE season_id = $1', [season_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/races
app.post('/api/races', async (req, res) => {
  const { season_id, track_name, race_date, is_double_points } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Race (season_id, track_name, race_date, is_double_points) VALUES ($1, $2, $3, $4) RETURNING *',
      [season_id, track_name, race_date, is_double_points]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/races/:id
app.put('/api/races/:id', async (req, res) => {
  const { id } = req.params;
  const { track_name, race_date, is_double_points } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Race SET track_name = $1, race_date = $2, is_double_points = $3 WHERE race_id = $4 RETURNING *',
      [track_name, race_date, is_double_points, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Race not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /api/races/:id
app.delete('/api/races/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Race WHERE race_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Race not found');
    }
    res.json({ message: 'Race deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
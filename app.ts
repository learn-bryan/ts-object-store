import express from 'express';
import { Pool } from 'pg';

// Create Express app
const app = express();
app.use(express.json()); 

// Create Postgres connection pool
const db = new Pool({
  user: 'tos_user',
  host: 'localhost',
  database: 'tosdb',
  password: 'insecurepassword',
  port: 5433,
});

// API route to get all objects
app.get('/objects', async (req, res) => {
  const result = await db.query('SELECT * FROM objects');
  res.json(result.rows);
});

// API route to get a single object by id
app.get('/objects/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM objects WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return res.status(404).send('Object not found');
  }

  res.json(result.rows[0]);
});

// API route to create a new object 
app.post('/objects', async (req, res) => {
  const { data } = req.body;

  const result = await db.query(
    'INSERT INTO objects (data) VALUES ($1) RETURNING *',
    [data]
  );

  res.status(201).json(result.rows[0]);
});

// API route to update an existing object
app.put('/objects/:id', async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const result = await db.query(
    'UPDATE objects SET data = $1 WHERE id = $3 RETURNING *',
    [data, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).send('Object not found');
  }

  res.json(result.rows[0]);
});

// API route to delete an object
app.delete('/objects/:id', async (req, res) => {
  const { id } = req.params;

  const result = await db.query('DELETE FROM objects WHERE id = $1', [id]);

  if (result.rowCount === 0) {
    return res.status(404).send('Object not found'); 
  }

  res.sendStatus(204);
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
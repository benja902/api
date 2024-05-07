const pg = require('pg');
require('dotenv').config();
const express = require('express');
const { ssl } = require('pg/lib/defaults');
const app = express();
const port = process.env.PORT;
const cors = require('cors');  
const path = require('path');

app.use(cors());

const pool = new pg.Pool({
  connectionString:process.env.DATABASE_URL,
  ssl: true
})

app.use(express.static(path.join(__dirname)));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/ping', async (req, res) => {
  const result = await pool.query('SELECT NOW()')
  return res.json(result.rows[0])
});

app.get('/api/codigos', async (req, res, next) => {
  try {
      const data = await pool.query('SELECT * FROM _mitabla');
      if (data.rows.length === 0) {
        res.status(404).json({ error: 'No se encontraron registros' });
      } else {
        res.json(data);
      }
  } catch (err) {
      next(err);
  }
});

app.get('/api/codigos/:nombre', async (req, res, next) => {
  try {
    const nombre = req.params.nombre;
    const data = await pool.query('SELECT * FROM _mitabla WHERE nombre = $1', [nombre]);
    if (data.rows.length === 0) {
        res.status(404).json({ error: 'No se encontró ningún registro con ese nombre' });
    } else {
        res.json(data.rows[0]);
    }
  } catch (err) {
    next(err);
  }
});

app.get('/api/codigosPorCodigo/:codigo', async (req, res, next) => {
    try {
      const codigo = req.params.codigo;
      const data = await pool.query('SELECT * FROM _mitabla WHERE codigo = $1', [codigo]);
      if (data.rows.length === 0) {
        res.status(404).json({ error: 'No se encontró ningún registro con ese código' });
      } else {
        res.json(data.rows[0]);
      }
    } catch (err) {
      next(err);
    }
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Ha ocurrido un error al obtener los datos' });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

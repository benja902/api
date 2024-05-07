const pg = require('pg');
require('dotenv').config();
const express = require('express');
const { ssl } = require('pg/lib/defaults');
const app = express();
const port = process.env.PORT;
const cors = require('cors');  
const path = require('path');

// const port = 3000;

app.use(cors());

const pool = new pg.Pool({
  connectionString:process.env.DATABASE_URL,
  ssl: true
})
// Tus datos
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/ping', async (req, res) => {
  const result = await pool.query('SELECT NOW()')
  return res.json(result.rows[0])
});
app.get('/api/codigos', async (req, res) => {
  try {
      const data = await pool.query('SELECT * FROM _mitabla');
      res.json(data);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ha ocurrido un error al obtener los datos' });
  }
});

app.get('/api/codigos/:nombre', async (req, res) => {
  try {
    const nombre = req.params.nombre;
    // nombre = decodeURIComponent(nombre);
    const data = await pool.query('SELECT * FROM _mitabla WHERE nombre = $1', [nombre]);
    res.json(data.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ha ocurrido un error al obtener los datos' });
  }
});
app.get('/api/codigosPorCodigo/:codigo', async (req, res) => {
    try {
      const codigo = req.params.codigo;
      // nombre = decodeURIComponent(nombre);
      const data = await pool.query('SELECT * FROM _mitabla WHERE codigo = $1', [codigo]);
      res.json(data.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ha ocurrido un error al obtener los datos' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
// const express = require('express');
// const faker = require('faker');
// const app = express();
// const port = 3000;

// let productos = [];

// for(let i = 0; i < 2000; i++) {
//     let producto = {
//         codigo: '20' + Math.floor(10000000 + Math.random() * 90000000), // Genera un número aleatorio de 8 dígitos y lo antecede con '20'
//         nombre: faker.commerce.productName()
//     };
//     productos.push(producto);
// }

// app.get('/api/codigos', (req, res) => {
//     res.json(productos);
// });

// app.listen(port, () => {
//     console.log(`Servidor corriendo en http://localhost:${port}`);
// });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes'); // Importar las rutas de autenticación
const manualsRoutes = require('./routes/manualsRoutes')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Habilitar CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/manuals', manualsRoutes)

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

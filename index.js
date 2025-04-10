require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes'); // Importar las rutas de autenticación
const logsRoutes = require('./routes/logsRoutes'); // Bitácora
const manualsRoutes = require('./routes/manualsRoutes');
const courseRoutes = require('./routes/courseRoutes');         
const moduleRoutes = require('./routes/moduleRoutes');         
const contentRoutes = require('./routes/contentRoutes');       
const enrollmentRoutes = require('./routes/enrollmentRoutes'); 
const attemptRoutes = require('./routes/attemptRoutes');   

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Habilitar CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/manuals', manualsRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/manuals', manualsRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/attempts', attemptRoutes);

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

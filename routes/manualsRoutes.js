const express = require('express');
const router = express.Router();
const { uploadManual, getManuals, downloadManual } = require('../controllers/cloudinaryController');
const authenticateToken = require('../middleware/authMiddleware');
const multer = require('multer');

// Almacén temporal para archivos
const upload = multer({ dest: 'uploads/' }); 

// Ruta para subir manuales (solo admins)
router.post('/upload', upload.single('file'), authenticateToken, uploadManual);

// Ruta para obtener todos los manuales (con autenticación)
router.get('/', authenticateToken, getManuals);

// Ruta para descargar manuales (con autenticación)
router.get('/download/:id', authenticateToken, downloadManual)

module.exports = router;

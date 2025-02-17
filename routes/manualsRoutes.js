const express = require('express');
const router = express.Router();
const { uploadManual, getManuals } = require('../controllers/cloudinaryController');
const authenticateToken = require('../middleware/authMiddleware');
const multer = require('multer');

// Almacén temporal para archivos
const upload = multer({ dest: 'uploads/' }); 

// Ruta para subir manuales (solo admins)
router.post('/upload', upload.single('file'), authenticateToken, uploadManual);

// Ruta para obtener todos los manuales (acceso público o con autenticación)
router.get('/', authenticateToken, getManuals);

module.exports = router;

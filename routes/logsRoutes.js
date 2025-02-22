const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logsController');
const authenticateToken = require('../middleware/authMiddleware');

// Ruta para subir manuales (solo admins)
router.get('/', authenticateToken, getLogs);


module.exports = router;
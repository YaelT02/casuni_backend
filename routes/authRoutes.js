const express = require('express');
const router = express.Router();
const { login, register, changePassword, logout } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/register', register);
router.post('/change-password', changePassword);
router.post('/logout', authenticateToken, logout);

// Ruta para validar el token (se mantiene POST)
router.post('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ user: req.user }); // Retorna los datos del usuario decodificados
});

module.exports = router;

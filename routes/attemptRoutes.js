// routes/attemptRoutes.js
const express = require('express');
const router = express.Router();
const { createAttempt, getAttempts } = require('../controllers/attemptController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/:enrollmentId/attempts', authenticateToken, createAttempt);
router.get('/:enrollmentId/attempts', authenticateToken, getAttempts);

module.exports = router;

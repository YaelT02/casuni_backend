// routes/enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const { enrollUser, updateProgress } = require('../controllers/enrollmentController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, enrollUser);
router.put('/:id', authenticateToken, updateProgress);

module.exports = router;

// routes/enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const { createEnrollment, getMyEnrollments, getEnrollmentById, updateEnrollment } = require('../controllers/enrollmentController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, createEnrollment);

router.get('/my', authenticateToken, getMyEnrollments);

router.get('/:id', authenticateToken, getEnrollmentById);

router.patch('/:id', authenticateToken, updateEnrollment);

module.exports = router;

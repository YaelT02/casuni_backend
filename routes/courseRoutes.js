// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const { createCourse, getCourses, getCourseById } = require('../controllers/courseController');
const authenticateToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

router.post('/', authenticateToken, verifyRole('admin'), createCourse);
router.get('/', authenticateToken, getCourses);
router.get('/:id', authenticateToken, getCourseById);

module.exports = router;

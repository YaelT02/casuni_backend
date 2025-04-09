// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const { createCourse, getCourses } = require('../controllers/courseController');
const authenticateToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

router.post('/', authenticateToken, verifyRole('admin'), createCourse);
router.get('/', authenticateToken, getCourses);

module.exports = router;

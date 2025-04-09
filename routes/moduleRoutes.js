// routes/moduleRoutes.js
const express = require('express');
const router = express.Router();
const { createModule, getModulesByCourse } = require('../controllers/moduleController');
const authenticateToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

router.post('/:trainingId/modules', authenticateToken, verifyRole('admin'), createModule);
router.get('/:trainingId/modules', authenticateToken, getModulesByCourse);

module.exports = router;

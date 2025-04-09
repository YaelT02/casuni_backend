// routes/contentRoutes.js
const express = require('express');
const router = express.Router();
const { uploadContent, getContentsByModule } = require('../controllers/contentController');
const authenticateToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/:moduleId/content', upload.single('file'), authenticateToken, verifyRole('admin'), uploadContent);
router.get('/:moduleId/content', authenticateToken, getContentsByModule);

module.exports = router;

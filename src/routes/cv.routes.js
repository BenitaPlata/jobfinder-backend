const express = require('express');
const multer = require('multer');
const { analyzeCV } = require('../controllers/cv.controller');
const authMiddleware = require('../middlewares/auth'); 

const router = express.Router();

// Multer en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// POST /api/cv/analyze
router.post(
  '/analyze',
  // authMiddleware,   // desactivado en dev
  upload.single('cv'),
  analyzeCV
);

module.exports = router;

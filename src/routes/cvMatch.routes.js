const express = require('express');
const authMiddleware = require('../middlewares/auth');
const { compareCVWithJob } = require('../controllers/cvMatch.controller');

const router = express.Router();

// POST /api/cv/compare/:jobId
router.post('/compare/:jobId', authMiddleware, compareCVWithJob);

module.exports = router;
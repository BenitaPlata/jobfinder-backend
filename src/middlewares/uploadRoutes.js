const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/cv', auth, upload.single('cv'), uploadController.uploadCV);
router.delete('/cv', auth, uploadController.deleteCV);

module.exports = router;
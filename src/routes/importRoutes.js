const express = require('express');
const router = express.Router();
const importController = require('../controllers/importController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

// Solo admin puede importar
router.post('/adzuna', auth, checkRole('admin'), importController.importFromAdzuna);

module.exports = router;
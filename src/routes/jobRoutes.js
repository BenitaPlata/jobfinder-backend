const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const { USER_ROLES } = require('../utils/constants');

// Rutas públicas (o con auth opcional)
router.get('/', jobController.getAllJobs);
router.get('/:jobId', jobController.getJobById);

// Rutas de admin
router.post('/', auth, checkRole(USER_ROLES.ADMIN), jobController.createJob);
router.put('/:jobId', auth, checkRole(USER_ROLES.ADMIN), jobController.updateJob);
router.delete(
  '/:jobId',
  auth,
  checkRole(USER_ROLES.ADMIN),
  jobController.deleteJob
);

module.exports = router;
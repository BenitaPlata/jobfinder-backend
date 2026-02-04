const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const { USER_ROLES } = require('../utils/constants');

// Rutas de usuario (protegidas)
router.post('/', auth, applicationController.createApplication);
router.get('/my-applications', auth, applicationController.getMyApplications);
router.put('/:applicationId', auth, applicationController.updateApplication);
router.delete('/:applicationId', auth, applicationController.deleteApplication);

// Rutas de admin
router.get(
  '/all',
  auth,
  checkRole(USER_ROLES.ADMIN),
  applicationController.getAllApplications
);
router.get(
  '/job/:jobId',
  auth,
  checkRole(USER_ROLES.ADMIN),
  applicationController.getApplicationsByJob
);

module.exports = router;
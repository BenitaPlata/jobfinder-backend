const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const { USER_ROLES } = require('../utils/constants');

// Configurar multer para subir CV
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Rutas de usuario (protegidas)
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.put('/cv', auth, userController.updateCV);
router.delete('/cv', auth, userController.deleteCV);

// 🆕 RUTAS PARA CV CON TEXTO
router.post('/upload-cv', auth, upload.single('cv'), userController.uploadCVText);
router.get('/my-cv', auth, userController.getMyCVText);
router.delete('/cv-text', auth, userController.deleteCVText);

// Rutas de admin
router.get('/', auth, checkRole(USER_ROLES.ADMIN), userController.getAllUsers);
router.delete(
  '/:userId',
  auth,
  checkRole(USER_ROLES.ADMIN),
  userController.deleteUser
);

module.exports = router;
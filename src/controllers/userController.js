const userRepository = require('../repositories/userRepository');
const pdfParse = require('pdf-parse');
const User = require('../models/User');
const { analyzeCVWithAI } = require('../services/cvAnalyzerService');

// =======================
// PERFIL
// =======================
const getProfile = async (req, res, next) => {
  try {
    const user = await userRepository.getUserById(req.user._id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, profile, preferences } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (profile) updateData.profile = { ...req.user.profile, ...profile };
    if (preferences)
      updateData.preferences = { ...req.user.preferences, ...preferences };

    const user = await userRepository.updateUser(req.user._id, updateData);

    res.json({
      message: 'Perfil actualizado correctamente',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// =======================
// CV ANTIGUO (URL)
// =======================
const updateCV = async (req, res, next) => {
  try {
    const { url, publicId, fileName } = req.body;

    if (!url || !publicId || !fileName) {
      return res.status(400).json({
        message: 'Datos del CV incompletos',
      });
    }

    const user = await userRepository.updateUser(req.user._id, {
      cv: {
        url,
        publicId,
        fileName,
        uploadedAt: new Date(),
      },
    });

    res.json({
      message: 'CV actualizado correctamente',
      cv: user.cv,
    });
  } catch (error) {
    next(error);
  }
};

// =======================
// 🆕 SUBIR CV (PDF → TEXTO)
// =======================
const uploadCVText = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        message: 'Solo se permiten archivos PDF',
      });
    }

    // ✅ pdf-parse (NODE SAFE)
    const pdfData = await pdfParse(req.file.buffer);
    const cvText = pdfData.text;

    if (!cvText || cvText.trim().length < 100) {
      return res.status(400).json({
        message: 'El PDF no contiene suficiente texto legible',
      });
    }

    const analysis = await analyzeCVWithAI(cvText);

    await User.findByIdAndUpdate(req.user._id, {
      cvText,
      cvSkills: analysis?.detectedSkills || [],
      cvUploadDate: new Date(),
    });

    res.json({
      success: true,
      message: 'CV guardado correctamente',
      skills: analysis?.detectedSkills || [],
      uploadDate: new Date(),
    });
  } catch (error) {
    console.error('❌ Error subiendo CV:', error);
    next(error);
  }
};

// =======================
// OBTENER CV
// =======================
const getMyCVText = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      'cvText cvSkills cvUploadDate'
    );

    if (!user?.cvText) {
      return res.status(404).json({
        success: false,
        message: 'No tienes un CV guardado',
      });
    }

    res.json({
      success: true,
      cvText: user.cvText,
      skills: user.cvSkills || [],
      uploadDate: user.cvUploadDate,
    });
  } catch (error) {
    next(error);
  }
};

// =======================
// ELIMINAR CV
// =======================
const deleteCVText = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      cvText: null,
      cvSkills: [],
      cvUploadDate: null,
    });

    res.json({
      success: true,
      message: 'CV eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

// =======================
// ADMIN
// =======================
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userRepository.getAllUsers();
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await userRepository.deleteUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateCV,
  deleteCV,
  getAllUsers,
  deleteUser,
  uploadCVText,
  getMyCVText,
  deleteCVText,
};

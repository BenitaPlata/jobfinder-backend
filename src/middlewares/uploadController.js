const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

const uploadCV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha enviado ningún archivo' });
    }

    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'jobfinder/cvs',
          resource_type: 'raw',
          public_id: `cv_${req.user._id}_${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      bufferStream.pipe(uploadStream);
    });

    res.json({
      message: 'CV subido correctamente',
      url: result.secure_url,
      publicId: result.public_id,
      fileName: req.file.originalname,
    });
  } catch (error) {
    console.error('Error subiendo CV:', error);
    next(error);
  }
};

const deleteCV = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ message: 'Se requiere el publicId' });
    }
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    res.json({ message: 'CV eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando CV:', error);
    next(error);
  }
};

module.exports = { uploadCV, deleteCV };
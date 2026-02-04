const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Obtener token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        message: 'No hay token, acceso denegado',
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: 'Token no válido',
      });
    }

    // Añadir usuario a la request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Token no válido',
    });
  }
};

module.exports = auth;
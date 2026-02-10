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

    // Buscar usuario en BBDD
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: 'Token no válido',
      });
    }

    // 🔥 AÑADIR USUARIO A LA REQUEST
    req.user = user;

    // 🔥 NORMALIZAR ROLE (CLAVE DEL PROBLEMA)
    // Garantiza coherencia: ADMIN / USER en todo el sistema
    if (req.user.role) {
      req.user.role = req.user.role.toUpperCase();
    }

    next();
  } catch (error) {
    console.error('❌ Error en auth middleware:', error);
    res.status(401).json({
      message: 'Token no válido',
    });
  }
};

module.exports = auth;
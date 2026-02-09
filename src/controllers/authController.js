const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');

// Generar JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};


// Registro
const register = async (req, res, next) => {
  try {
    console.log('📝 Datos recibidos en register:', req.body);

    const { name, email, password, sector } = req.body;

    // Validar campos requeridos
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Verificar si el email ya existe
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: 'El email ya está registrado',
      });
    }

    // Crear usuario
    const user = await userRepository.createUser({
      name,
      email,
      password,
      profile: { sector: sector || 'Tech' },
    });

    // Generar token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.toUpperCase(),
        sector: user.profile.sector,
      },
    });
  } catch (error) {
    console.error('❌ Error en register:', error);
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email y contraseña son obligatorios',
      });
    }

    // Buscar usuario
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        message: 'Credenciales incorrectas',
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Credenciales incorrectas',
      });
    }

    // Generar token
    const token = generateToken(user._id);

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        sector: user.profile?.sector,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Obtener usuario autenticado
const getMe = async (req, res, next) => {
  try {
    const user = await userRepository.getUserById(req.user._id);

    res.json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
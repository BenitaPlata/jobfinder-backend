require('dotenv').config();
const express = require('express');
const cors = require('cors');

/* ========= IMPORTS ========= */
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorHandler');

/* ========= ROUTES ========= */
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');
const importRoutes = require('./src/routes/importRoutes');
const cvRoutes = require('./src/routes/cv.routes');
const cvMatchRoutes = require('./src/routes/cvMatch.routes');

const app = express();
const PORT = process.env.PORT || 3000;

/* ========= DEBUG ========= */
console.log('🔥 Index cargado correctamente');

/* ========= BODY PARSERS ========= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ========= CORS (ROBUSTO PARA VERCEL) ========= */
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      // Local
      if (origin === 'http://localhost:5173') {
        return callback(null, true);
      }

      // CUALQUIER dominio de Vercel
      if (origin.includes('.vercel.app')) {
        return callback(null, true);
      }

      // Bloquear el resto
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

/* ========= DB ========= */
connectDB();

/* ========= HEALTHCHECK ========= */
app.get('/', (req, res) => {
  res.json({ message: '✅ API JobFinder funcionando' });
});

/* ========= ROUTES ========= */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/import', importRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/cv', cvMatchRoutes);

/* ========= 404 ========= */
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

/* ========= ERROR HANDLER ========= */
app.use(errorHandler);

/* ========= SERVER ========= */
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

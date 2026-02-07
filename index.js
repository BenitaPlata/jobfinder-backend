require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 🔴 IMPORTACIONES
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorHandler');

// Rutas
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');
const importRoutes = require('./src/routes/importRoutes');

// ✅ CV ROUTES
const cvRoutes = require('./src/routes/cv.routes');
// const cvMatchRoutes = require('./src/routes/cvMatch.routes'); // opcional más adelante

const app = express();
const PORT = process.env.PORT || 3000;

/* ========= DEBUG START ========= */
console.log('🔥 Index cargado correctamente');
/* ========= DEBUG END ========= */

/* ========= MIDDLEWARES BASE ========= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ========= CORS (FIX PRODUCCIÓN) ========= */
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://jobfinder-app-ai.vercel.app',
    ],
    credentials: true,
  })
);

/* ========= DB ========= */
connectDB();

/* ========= ROUTE TEST ========= */
app.get('/', (req, res) => {
  res.json({
    message: '✅ API JobFinder funcionando',
  });
});

/* ========= ROUTES ========= */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/import', importRoutes);

// ✅ CV ANALYZE
app.use('/api/cv', cvRoutes);

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

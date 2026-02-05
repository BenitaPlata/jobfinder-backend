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

// ⚠️ SOSPECHOSOS (los dejamos importados pero NO montados aún)
const cvRoutes = require('./src/routes/cv.routes');
const cvMatchRoutes = require('./src/routes/cvMatch.routes');

// ⚠️ CRON sospechoso
// const { startJobUpdateCron } = require('./src/cron/updateJobs');

const app = express();
const PORT = process.env.PORT || 3000;

/* ========= DEBUG START ========= */
console.log("🔥 Index cargado correctamente");
/* ========= DEBUG END ========= */


/* ========= MIDDLEWARES BASE ========= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* ========= CORS ========= */
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'https://jobfinder-app-ai.vercel.app',
      /^https:\/\/jobfinder-frontend-.*\.vercel\.app$/,
      /^https:\/\/jobfinder-frontend-.*-benita-plata-projects\.vercel\.app$/
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


/* ========= ROUTES ESTABLES ========= */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/import', importRoutes);


/* ========= ROUTES SOSPECHOSAS (DESACTIVADAS TEMPORALMENTE) ========= */

// 👉 Activar cuando confirmemos que todo funciona
/*
app.use('/api/cv', cvRoutes);
app.use('/api/cv', cvMatchRoutes);
*/


/* ========= CRON DESACTIVADO TEMPORAL ========= */

// 👉 Activar cuando backend esté estable
/*
startJobUpdateCron();
*/


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

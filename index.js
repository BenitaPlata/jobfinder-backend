require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorHandler');

// Rutas
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');
const importRoutes = require('./src/routes/importRoutes');
const cvRoutes = require('./src/routes/cv.routes');
const cvMatchRoutes = require('./src/routes/cvMatch.routes');

const app = express();
const PORT = process.env.PORT || 3000;

/* ========= MIDDLEWARES BASE ========= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ========= CORS ========= */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

/* ========= DB ========= */
connectDB();

/* ========= ROUTES ========= */
app.get('/', (req, res) => {
  res.json({
    message: '✅ API JobFinder funcionando',
  });
});

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

/* ========= CRON ========= */
const { startJobUpdateCron } = require('./src/cron/updateJobs');
startJobUpdateCron();

/* ========= SERVER ========= */
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

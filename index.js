require('dotenv').config();
const express = require('express');
const cors = require('cors');

/* ========= IMPORTS ========= */
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorHandler');
const { startJobUpdateCron } = require('./src/cron/updateJobs');

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

/* ========= TRUST PROXY (Railway) ========= */
app.set('trust proxy', 1);

/* ========= CORS ========= */
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://jobfinder-app-ai.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

/* ========= BODY PARSERS ========= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ========= DB ========= */
connectDB();

/* ========= CRON JOBS ========= */
startJobUpdateCron();

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
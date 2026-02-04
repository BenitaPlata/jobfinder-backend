require('dotenv').config();
const cron = require('node-cron');
const connectDB = require('../config/db');
const adzunaService = require('../services/adzunaService');
const Job = require('../models/Job');

// Función para importar ofertas automáticamente
async function importJobsAutomatically() {
  try {
    const mongoose = require('mongoose');
    
    // Conectar a MongoDB si no está conectado
    if (mongoose.connection.readyState === 0) {
      await connectDB();
      console.log('⏳ Esperando conexión a MongoDB...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('🔄 [CRON] Iniciando actualización automática de ofertas...');

    const searchQueries = [
      { what: 'software developer', pages: 3 },
      { what: 'frontend react', pages: 2 },
      { what: 'backend nodejs', pages: 2 },
    ];

    let totalImported = 0;
    let totalDuplicates = 0;

    for (const query of searchQueries) {
      console.log(`🔍 [CRON] Buscando: "${query.what}"...`);

      const jobs = await adzunaService.searchJobs({
        what: query.what,
        where: 'España',
        pages: query.pages,
        results_per_page: 50,
      });

      // Guardar en BD evitando duplicados
      for (const jobData of jobs) {
        const exists = await Job.findOne({
          title: jobData.title,
          company: jobData.company,
        });

        if (!exists) {
          await Job.create(jobData);
          totalImported++;
        } else {
          totalDuplicates++;
        }
      }
    }

    console.log(`✅ [CRON] Actualización completada:`);
    console.log(`   - Ofertas nuevas: ${totalImported}`);
    console.log(`   - Duplicados omitidos: ${totalDuplicates}`);
    console.log(`   - Total en BD: ${await Job.countDocuments()}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ [CRON] Error en actualización automática:', error);
    process.exit(1);
  }
}

// Configurar cron job
function startJobUpdateCron() {
  // Ejecutar todos los días a las 3:00 AM
  cron.schedule('0 3 * * *', () => {
    console.log('⏰ [CRON] Ejecutando tarea programada...');
    importJobsAutomatically();
  });

  console.log('✅ [CRON] Job scheduler iniciado');
  console.log('⏰ [CRON] Próxima ejecución: Todos los días a las 3:00 AM');
}

module.exports = {
  startJobUpdateCron,
  importJobsAutomatically,
};

const adzunaService = require('../services/adzunaService');
const Job = require('../models/Job');

// Importar ofertas de Adzuna
const importFromAdzuna = async (req, res) => {
  try {
    const { what = '', where = 'España', pages = 2 } = req.body;

    let allJobs = [];

    // Buscar en múltiples páginas
    for (let page = 1; page <= pages; page++) {
      const jobs = await adzunaService.searchJobs({
        what,
        where,
        page,
        results_per_page: 50,
      });

      allJobs = allJobs.concat(jobs);
    }

    console.log(`📦 Total ofertas obtenidas: ${allJobs.length}`);

    // Guardar en BD (evitar duplicados por título + empresa)
    let saved = 0;
    let duplicates = 0;

    for (const jobData of allJobs) {
      const exists = await Job.findOne({
        title: jobData.title,
        company: jobData.company,
      });

      if (!exists) {
        await Job.create(jobData);
        saved++;
      } else {
        duplicates++;
      }
    }

    res.json({
      message: 'Importación completada',
      total: allJobs.length,
      saved,
      duplicates,
    });
  } catch (error) {
    console.error('Error importando ofertas:', error);
    res.status(500).json({ message: 'Error importando ofertas', error: error.message });
  }
};

module.exports = {
  importFromAdzuna,
};
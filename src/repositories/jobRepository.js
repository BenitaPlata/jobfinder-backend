const Job = require('../models/Job');
const { calculateDistance } = require('../utils/distanceCalculator');

const createJob = async (jobData) => {
  const job = new Job(jobData);
  await job.save();
  return job;
};

const getJobById = async (jobId) => {
  const job = await Job.findById(jobId).populate('createdBy', 'name email');
  return job;
};

const updateJob = async (jobId, updateData) => {
  const job = await Job.findByIdAndUpdate(jobId, updateData, {
    new: true,
    runValidators: true,
  });
  return job;
};

const deleteJob = async (jobId) => {
  const job = await Job.findByIdAndDelete(jobId);
  return job;
};

const getJobs = async (filters = {}) => {
  const {
    page = 1,
    limit = 50,
    sector,
    city,
    contractType,
    minSalary,
    workModality,
    technologies,
    companyType,
    englishLevel,
    showSalary,
    userLat,
    userLng,
    maxDistance,
  } = filters;

  const query = { isActive: true };

  // Filtro por sector
  if (sector) {
    query.sector = sector;
  }

  // ✅ CAMBIO: Solo filtrar por ciudad si NO es remoto
  if (city && workModality !== 'Remote') {
    query['location.city'] = new RegExp(city, 'i');
  }

  // Filtro por tipo de contrato
  if (contractType) {
    query.contractType = contractType;
  }

  // Filtro por salario mínimo
  if (minSalary) {
    query['salaryRange.min'] = { $gte: parseInt(minSalary) };
  }

  // Filtros específicos de Tech
  if (workModality) {
    query['techDetails.workModality'] = workModality;
  }

  if (technologies) {
    const techArray = technologies.split(',').map((t) => t.trim());
    query['techDetails.technologies'] = { $in: techArray };
  }

  if (companyType) {
    query['techDetails.companyType'] = companyType;
  }

  if (englishLevel) {
    query['techDetails.englishLevel'] = englishLevel;
  }

  // Filtro "solo con salario visible"
  if (showSalary === 'true' || showSalary === true) {
    query['salaryRange.min'] = { $exists: true, $ne: null, $gt: 0 };
  }

  // SI HAY FILTRO DE DISTANCIA, traer TODAS las ofertas para filtrarlas
  let jobs;
  let total;
  
  if (userLat && userLng && maxDistance) {
    // Traer TODAS las ofertas sin paginación
    jobs = await Job.find(query)
      .populate('createdBy', 'name email')
      .sort({ postedDate: -1 });

    const userCoordinates = {
      lat: parseFloat(userLat),
      lng: parseFloat(userLng),
    };

    // Filtrar por distancia
    jobs = jobs
      .map((job) => {
        // Si el trabajo es remoto, incluirlo siempre
        if (job.location.isRemote) {
          job._doc.distanceFromUser = 0;
          return job;
        }

        const distance = calculateDistance(
          userCoordinates,
          job.location.coordinates
        );

        if (distance !== null && distance <= parseFloat(maxDistance)) {
          job._doc.distanceFromUser = distance;
          return job;
        }

        return null;
      })
      .filter((job) => job !== null)
      .sort((a, b) => a._doc.distanceFromUser - b._doc.distanceFromUser);

    // AHORA sí, contar el total DESPUÉS del filtro
    total = jobs.length;

    // Aplicar paginación DESPUÉS del filtro de distancia
    const skip = (page - 1) * limit;
    jobs = jobs.slice(skip, skip + parseInt(limit));

  } else {
    // SIN filtro de distancia, paginación normal
    const skip = (page - 1) * limit;
    
    jobs = await Job.find(query)
      .populate('createdBy', 'name email')
      .sort({ postedDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    total = await Job.countDocuments(query);
  }

  return {
    jobs,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };
};

const incrementViewCount = async (jobId) => {
  const job = await Job.findByIdAndUpdate(
    jobId,
    { $inc: { viewsCount: 1 } },
    { new: true }
  );
  return job;
};

const incrementApplicationCount = async (jobId) => {
  const job = await Job.findByIdAndUpdate(
    jobId,
    { $inc: { applicationsCount: 1 } },
    { new: true }
  );
  return job;
};

module.exports = {
  createJob,
  getJobById,
  getJobs,
  updateJob,
  deleteJob,
  incrementViewCount,
  incrementApplicationCount,
};
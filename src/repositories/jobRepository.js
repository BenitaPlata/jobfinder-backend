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
  return await Job.findByIdAndDelete(jobId);
};

const getJobs = async (filters = {}) => {
  const {
    page = 1,
    limit,
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
    experienceRequired,
  } = filters;

  const query = { isActive: true };

  console.log('🔍 Filtros recibidos:', { experienceRequired, workModality, city });

  if (sector) query.sector = sector;

  if (city) {
    if (workModality === 'Hybrid' || workModality === 'On-site') {
      query['location.city'] = new RegExp(city, 'i');
    } else if (!workModality) {
      query.$or = [
        { 'location.isRemote': true },
        { 'location.city': new RegExp(city, 'i') },
      ];
    }
  }

  if (contractType) query.contractType = contractType;

  if (minSalary) {
    query['salaryRange.min'] = { $gte: parseInt(minSalary) };
  }

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

  // Filtro por nivel de experiencia
  if (experienceRequired) {
    query['techDetails.experienceRequired'] = experienceRequired;
  }

  if (showSalary === 'true' || showSalary === true) {
    query['salaryRange.min'] = { $exists: true, $gt: 0 };
  }

  console.log('📋 Query MongoDB construida:', JSON.stringify(query, null, 2));

  let jobs;
  let total;

  // ============================
  // FILTRO POR DISTANCIA
  // ============================
  if (userLat && userLng && maxDistance) {
    jobs = await Job.find(query)
      .populate('createdBy', 'name email')
      .sort({ postedDate: -1 });

    const userCoordinates = {
      lat: parseFloat(userLat),
      lng: parseFloat(userLng),
    };

    jobs = jobs
      .map((job) => {
        if (job.location.isRemote) {
          job._doc.distanceFromUser = 0;
          return job;
        }

        const distance = calculateDistance(userCoordinates, job.location.coordinates);

        if (distance !== null && distance <= parseFloat(maxDistance)) {
          job._doc.distanceFromUser = distance;
          return job;
        }

        return null;
      })
      .filter(Boolean)
      .sort((a, b) => a._doc.distanceFromUser - b._doc.distanceFromUser);

    total = jobs.length;

    if (limit) {
      const skip = (page - 1) * limit;
      jobs = jobs.slice(skip, skip + Number(limit));
    }
  } else {
    // ============================
    // SIN DISTANCIA
    // ============================
    let queryBuilder = Job.find(query)
      .populate('createdBy', 'name email')
      .sort({ postedDate: -1 });

    if (limit) {
      const skip = (page - 1) * limit;
      queryBuilder = queryBuilder.skip(skip).limit(Number(limit));
    }

    jobs = await queryBuilder;
    total = await Job.countDocuments(query);
  }

  console.log('📊 Resultados encontrados:', total);

  return {
    jobs,
    total,
    page: Number(page),
    totalPages: limit ? Math.ceil(total / limit) : 1,
  };
};

const incrementViewCount = async (jobId) => {
  return await Job.findByIdAndUpdate(jobId, { $inc: { viewsCount: 1 } }, { new: true });
};

const incrementApplicationCount = async (jobId) => {
  return await Job.findByIdAndUpdate(
    jobId,
    { $inc: { applicationsCount: 1 } },
    { new: true }
  );
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
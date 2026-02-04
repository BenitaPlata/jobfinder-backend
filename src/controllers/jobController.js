const jobRepository = require('../repositories/jobRepository');

// Obtener todas las ofertas (con filtros)
const getAllJobs = async (req, res, next) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      sector: req.query.sector,
      contractType: req.query.contractType,
      minSalary: req.query.minSalary,
      city: req.query.city,
      technologies: req.query.technologies,
      workModality: req.query.workModality,
      companyType: req.query.companyType,
      englishLevel: req.query.englishLevel,
      showSalary: req.query.showSalary,
      userLat: req.query.userLat,
      userLng: req.query.userLng,
      maxDistance: req.query.maxDistance,
    };

    const result = await jobRepository.getJobs(filters);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Obtener una oferta por ID
const getJobById = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await jobRepository.getJobById(jobId);

    if (!job) {
      return res.status(404).json({
        message: 'Oferta no encontrada',
      });
    }

    // Incrementar contador de vistas
    await jobRepository.incrementViewCount(jobId);

    res.json({
      job,
    });
  } catch (error) {
    next(error);
  }
};

// Crear nueva oferta (solo admin)
const createJob = async (req, res, next) => {
  try {
    const jobData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const job = await jobRepository.createJob(jobData);

    res.status(201).json({
      message: 'Oferta creada correctamente',
      job,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar oferta (solo admin)
const updateJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await jobRepository.updateJob(jobId, req.body);

    if (!job) {
      return res.status(404).json({
        message: 'Oferta no encontrada',
      });
    }

    res.json({
      message: 'Oferta actualizada correctamente',
      job,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar oferta (solo admin)
const deleteJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await jobRepository.deleteJob(jobId);

    if (!job) {
      return res.status(404).json({
        message: 'Oferta no encontrada',
      });
    }

    res.json({
      message: 'Oferta eliminada correctamente',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
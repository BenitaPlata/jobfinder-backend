const applicationRepository = require('../repositories/applicationRepository');
const jobRepository = require('../repositories/jobRepository');
const { APPLICATION_STATUS } = require('../utils/constants');
const { calculateDistance } = require('../utils/distanceCalculator');

// Crear aplicación (guardar o aplicar)
const createApplication = async (req, res, next) => {
  try {
    const { jobId, status, notes } = req.body;

    if (!jobId) {
      return res.status(400).json({
        message: 'El ID de la oferta es obligatorio',
      });
    }

    // Verificar que la oferta existe
    const job = await jobRepository.getJobById(jobId);
    if (!job) {
      return res.status(404).json({
        message: 'Oferta no encontrada',
      });
    }

    // Verificar que no haya aplicado ya
    const existingApplication = await applicationRepository.checkExistingApplication(
      req.user._id,
      jobId
    );

    if (existingApplication) {
      return res.status(400).json({
        message: 'Ya has aplicado a esta oferta',
      });
    }

    // Calcular distancia si hay coordenadas
    let distanceFromUser = null;
    if (
      req.user.profile.location?.coordinates &&
      job.location?.coordinates &&
      !job.location.isRemote
    ) {
      distanceFromUser = calculateDistance(
        req.user.profile.location.coordinates,
        job.location.coordinates
      );
    }

    // Crear aplicación
    const applicationData = {
      userId: req.user._id,
      jobId,
      status: status || APPLICATION_STATUS.SAVED,
      notes,
      distanceFromUser,
    };

    // Si el status es "Applied", añadir fecha de aplicación
    if (status === APPLICATION_STATUS.APPLIED) {
      applicationData.appliedDate = new Date();
      // Incrementar contador de aplicaciones en la oferta
      await jobRepository.incrementApplicationCount(jobId);
    }

    const application = await applicationRepository.createApplication(
      applicationData
    );

    // Popular datos
    const populatedApplication = await applicationRepository.getApplicationById(
      application._id
    );

    res.status(201).json({
      message: 'Aplicación creada correctamente',
      application: populatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener aplicaciones del usuario
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await applicationRepository.getApplicationsByUser(
      req.user._id
    );

    res.json({
      applications,
      count: applications.length,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar estado de aplicación
const updateApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status, notes, interviewDate } = req.body;

    const application = await applicationRepository.getApplicationById(
      applicationId
    );

    if (!application) {
      return res.status(404).json({
        message: 'Aplicación no encontrada',
      });
    }

    // Verificar que es el dueño de la aplicación
    if (application.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'No tienes permisos para actualizar esta aplicación',
      });
    }

    const updateData = {};
    if (status) {
      updateData.status = status;
      // Si cambia a Applied, añadir fecha
      if (status === APPLICATION_STATUS.APPLIED && !application.appliedDate) {
        updateData.appliedDate = new Date();
        await jobRepository.incrementApplicationCount(application.jobId._id);
      }
    }
    if (notes !== undefined) updateData.notes = notes;
    if (interviewDate) updateData.interviewDate = interviewDate;

    const updatedApplication = await applicationRepository.updateApplication(
      applicationId,
      updateData
    );

    const populatedApplication = await applicationRepository.getApplicationById(
      updatedApplication._id
    );

    res.json({
      message: 'Aplicación actualizada correctamente',
      application: populatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar aplicación
const deleteApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const application = await applicationRepository.getApplicationById(
      applicationId
    );

    if (!application) {
      return res.status(404).json({
        message: 'Aplicación no encontrada',
      });
    }

    // Verificar que es el dueño de la aplicación
    if (application.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'No tienes permisos para eliminar esta aplicación',
      });
    }

    await applicationRepository.deleteApplication(applicationId);

    res.json({
      message: 'Aplicación eliminada correctamente',
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Obtener todas las aplicaciones
const getAllApplications = async (req, res, next) => {
  try {
    const applications = await applicationRepository.getAllApplications();

    res.json({
      applications,
      count: applications.length,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Obtener aplicaciones por oferta
const getApplicationsByJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const applications = await applicationRepository.getApplicationsByJob(jobId);

    res.json({
      applications,
      count: applications.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  updateApplication,
  deleteApplication,
  getAllApplications,
  getApplicationsByJob,
};
const Application = require('../models/Application');
const { calculateDistance } = require('../utils/distanceCalculator');

const createApplication = async (applicationData) => {
  const application = new Application(applicationData);
  await application.save();
  return application;
};

const getApplicationById = async (applicationId) => {
  const application = await Application.findById(applicationId)
    .populate('userId', 'name email')
    .populate('jobId');
  return application;
};

const getApplicationsByUser = async (userId) => {
  const applications = await Application.find({ userId })
    .populate('jobId')
    .sort({ createdAt: -1 });
  return applications;
};

const getApplicationsByJob = async (jobId) => {
  const applications = await Application.find({ jobId })
    .populate('userId', 'name email profile.title')
    .sort({ createdAt: -1 });
  return applications;
};

const getAllApplications = async () => {
  const applications = await Application.find()
    .populate('userId', 'name email')
    .populate('jobId', 'title company')
    .sort({ createdAt: -1 });
  return applications;
};

const updateApplication = async (applicationId, updateData) => {
  const application = await Application.findByIdAndUpdate(
    applicationId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
  return application;
};

const deleteApplication = async (applicationId) => {
  const application = await Application.findByIdAndDelete(applicationId);
  return application;
};

const checkExistingApplication = async (userId, jobId) => {
  const application = await Application.findOne({ userId, jobId });
  return application;
};

module.exports = {
  createApplication,
  getApplicationById,
  getApplicationsByUser,
  getApplicationsByJob,
  getAllApplications,
  updateApplication,
  deleteApplication,
  checkExistingApplication,
};
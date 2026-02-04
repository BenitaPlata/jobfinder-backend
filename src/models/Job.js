const mongoose = require('mongoose');
const { SECTORS, CONTRACT_TYPES } = require('../utils/constants');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'La empresa es obligatoria'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
    },
    sector: {
      type: String,
      enum: ['Tech'],
      default: 'Tech',
      required: true,
    },
    location: {
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
      city: {
        type: String,
        required: true,
      },
      province: String,
      country: {
        type: String,
        default: 'España',
      },
      isRemote: {
        type: Boolean,
        default: false,
      },
    },
    contractType: {
      type: String,
      enum: CONTRACT_TYPES,
      required: [true, 'El tipo de contrato es obligatorio'],
    },
    salaryRange: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'EUR',
      },
      isNegotiable: {
        type: Boolean,
        default: false,
      },
    },
    // Campos específicos para Tech
    techDetails: {
      technologies: {
        type: [String],
        default: [],
      },
      experienceRequired: {
        type: String,
        enum: ['Intern', 'Junior', 'Mid-level', 'Senior', 'Lead'],
        default: 'Mid-level',
      },
      workModality: {
        type: String,
        enum: ['Remote', 'Hybrid', 'On-site'],
        default: 'On-site',
      },
      companyType: {
        type: String,
        enum: ['Startup', 'Scaleup', 'Grande', 'Consultora', 'Producto'],
        default: 'Startup',
      },
      englishLevel: {
        type: String,
        enum: ['none', 'basic', 'intermediate', 'advanced', 'native'],
        default: 'none',
      },
    },

    // Metadata
    source: {
      type: String,
      enum: ['InfoJobs', 'LinkedIn', 'Indeed', 'Manual', 'Adzuna'],
      default: 'Manual',
    },
    externalUrl: String,
    companyLogo: String,
    postedDate: {
      type: Date,
      default: Date.now,
    },
    expirationDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;

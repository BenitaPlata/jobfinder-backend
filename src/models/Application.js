const mongoose = require('mongoose');
const { APPLICATION_STATUS } = require('../utils/constants');

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.SAVED,
    },
    appliedDate: Date,
    notes: {
      type: String,
      maxlength: 500,
    },
    distanceFromUser: Number,
    interviewDate: Date,
  },
  {
    timestamps: true,
  }
);

// Índice compuesto para evitar duplicados (un usuario no puede aplicar 2 veces a la misma oferta)
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
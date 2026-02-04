const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { SECTORS, USER_ROLES } = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'El email no es válido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    profile: {
      sector: {
        type: String,
        enum: Object.values(SECTORS),
        required: [true, 'El sector es obligatorio'],
      },
      title: {
        type: String,
        trim: true,
      },
      location: {
        address: String,
        coordinates: {
          lat: Number,
          lng: Number,
        },
        city: String,
        province: String,
        country: {
          type: String,
          default: 'España',
        },
      },
      phone: String,
      linkedIn: String,
      github: String,
      portfolio: String,
    },
    cv: {
      url: String,
      publicId: String,
      fileName: String,
      uploadedAt: Date,
    },
    preferences: {
      locations: [String],
      maxDistance: {
        type: Number,
        default: 50,
      },
      contractTypes: [String],
      minSalary: Number,
      technologies: [String],
      experienceLevel: [String],
      workModality: [String],
      companyType: [String],
      educationStage: [String],
      centerType: [String],
      schedule: [String],
    },

    cvText: {
      type: String,
      default: null,
    },
    cvSkills: {
      type: [String],
      default: [],
    },
    cvUploadDate: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

// Hashear password antes de guardar
// Hashear password antes de guardar
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10); 
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

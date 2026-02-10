// ==============================
// Sectores disponibles
// ==============================
const SECTORS = {
  TECH: 'Tech',
};

// ==============================
// Configuración por sector
// ==============================
const SECTOR_CONFIG = {
  [SECTORS.TECH]: {
    label: 'Tecnología',
    icon: '💻',
    description: 'Desarrollo, IT, Software',
    filters: [
      'technologies',
      'experienceLevel',
      'workModality',
      'companyType',
      'englishLevel',
    ],
  },
};

// ==============================
// Opciones de filtros (Tech)
// ==============================
const FILTER_OPTIONS = {
  technologies: [
    'React',
    'Node.js',
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'PHP',
    'Angular',
    'Vue.js',
    'MongoDB',
    'MySQL',
    'PostgreSQL',
    'Docker',
    'Kubernetes',
    'AWS',
    'Git',
  ],
  experienceLevel: ['Junior', 'Mid-level', 'Senior', 'Lead', 'Intern'],
  workModality: ['Remote', 'Hybrid', 'On-site'],
  companyType: ['Startup', 'Scaleup', 'Grande', 'Consultora', 'Producto'],
  englishLevel: ['none', 'basic', 'intermediate', 'advanced', 'native'],
};

// ==============================
// Tipos de contrato
// ==============================
const CONTRACT_TYPES = [
  'Full-time',
  'Part-time',
  'Freelance',
  'Internship',
  'Temporal',
  'Indefinido',
];

// ==============================
// Roles de usuario
// ==============================
const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

// ==============================
// Estados de candidatura
// ==============================
const APPLICATION_STATUS = {
  SAVED: 'Saved',
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  REJECTED: 'Rejected',
  ACCEPTED: 'Accepted',
};

module.exports = {
  SECTORS,
  SECTOR_CONFIG,
  FILTER_OPTIONS,
  CONTRACT_TYPES,
  USER_ROLES,
  APPLICATION_STATUS,
};

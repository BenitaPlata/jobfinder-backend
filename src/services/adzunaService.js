const axios = require('axios');

const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/jobs';
const COUNTRY = 'es';
const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;

async function searchJobs(options = {}) {
  try {
    const {
      what = '',
      where = 'España',
      page = 1,
      results_per_page = 50,
      category = '',
    } = options;

    const url = `${ADZUNA_BASE_URL}/${COUNTRY}/search/${page}`;

    const params = {
      app_id: APP_ID,
      app_key: APP_KEY,
      what,
      where,
      results_per_page,
      'content-type': 'application/json',
    };

    if (category) {
      params.category = category;
    }

    console.log('🔍 Llamando a Adzuna API:', url);

    const response = await axios.get(url, { params });

    console.log(`✅ Adzuna devolvió ${response.data.results.length} ofertas`);

    const normalizedJobs = response.data.results.map((job) => normalizeJob(job));

    return normalizedJobs;
  } catch (error) {
    console.error('❌ Error llamando a Adzuna:', error.message);
    throw error;
  }
}

function normalizeJob(adzunaJob) {
 const workModality = isRemoteJob(adzunaJob.title, adzunaJob.description);

const location = {
  address: adzunaJob.location?.display_name || 'España',
  city: adzunaJob.location?.area?.[2] || 'Madrid',
  province: adzunaJob.location?.area?.[1] || 'Madrid',
  country: 'España',
  coordinates: {
    lat: adzunaJob.latitude || 40.4168,
    lng: adzunaJob.longitude || -3.7038,
  },
  isRemote: workModality === 'Remote' || workModality === 'Hybrid',
};
  return {
    title: adzunaJob.title,
    company: adzunaJob.company?.display_name || 'Empresa Confidencial',
    description: adzunaJob.description || 'Sin descripción',
    sector: 'Tech', // Solo Tech
    location,
    contractType: detectContractType(adzunaJob.contract_type, adzunaJob.title),
    salaryRange: {
      min: adzunaJob.salary_min || 18000,
      max: adzunaJob.salary_max || 40000,
      currency: 'EUR',
      isNegotiable: !adzunaJob.salary_min,
    },
    source: 'Adzuna',
    externalUrl: adzunaJob.redirect_url,
    postedDate: new Date(adzunaJob.created),
    isActive: true,
    techDetails: extractTechDetails(adzunaJob.title, adzunaJob.description),
  };
}

function isRemoteJob(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  
  // Palabras clave para remoto
  const remoteKeywords = [
    'remote',
    'remoto',
    'teletrabajo',
    'trabajo remoto',
    'home office',
    'desde casa',
    'work from home',
    'wfh',
    '100% remoto',
    'fully remote',
    'remote first',
  ];

  // Palabras clave para híbrido
  const hybridKeywords = [
    'hybrid',
    'híbrido',
    'hibrido',
    'semi-presencial',
    'flexible',
  ];

  // Verificar remoto
  if (remoteKeywords.some(keyword => text.includes(keyword))) {
    return 'Remote';
  }

  // Verificar híbrido
  if (hybridKeywords.some(keyword => text.includes(keyword))) {
    return 'Hybrid';
  }

  return 'On-site';
}
function detectContractType(contractType, title) {
  if (contractType) {
    return contractType === 'permanent' ? 'Indefinido' : 'Temporal';
  }

  const text = title.toLowerCase();
  if (text.includes('indefinido')) return 'Indefinido';
  if (text.includes('temporal')) return 'Temporal';
  if (text.includes('freelance')) return 'Freelance';
  if (text.includes('practicas') || text.includes('prácticas')) return 'Internship';

  return 'Full-time';
}

function extractTechDetails(title, description) {
  const text = `${title} ${description}`.toLowerCase();

  const technologies = [];
  const techList = [
    'react',
    'node.js',
    'python',
    'java',
    'angular',
    'vue',
    'typescript',
    'javascript',
    'mongodb',
    'sql',
    'php',
    'c#',
    'ruby',
    'go',
    'kotlin',
    'swift',
    'docker',
    'kubernetes',
    'aws',
    'azure',
  ];

  techList.forEach((tech) => {
    if (text.includes(tech.toLowerCase())) {
      technologies.push(tech);
    }
  });

  // Detectar nivel de inglés
  let englishLevel = 'none';
  if (text.includes('english') || text.includes('inglés')) {
    if (text.includes('c1') || text.includes('c2') || text.includes('native') || text.includes('fluent')) {
      englishLevel = 'advanced';
    } else if (text.includes('b2')) {
      englishLevel = 'intermediate';
    } else if (text.includes('b1') || text.includes('a2')) {
      englishLevel = 'basic';
    } else {
      englishLevel = 'intermediate';
    }
  }

  // Detectar tipo de empresa
  let companyType = 'Startup';
  if (text.includes('startup')) companyType = 'Startup';
  else if (text.includes('scaleup')) companyType = 'Scaleup';
  else if (text.includes('consultora') || text.includes('consulting')) companyType = 'Consultora';
  else if (text.includes('producto') || text.includes('product')) companyType = 'Producto';
  else if (text.includes('gran empresa') || text.includes('multinacional')) companyType = 'Grande';

  // Detectar experiencia
  let experienceRequired = 'Mid-level';
  if (text.includes('senior') || text.includes('lead')) experienceRequired = 'Senior';
  else if (text.includes('junior')) experienceRequired = 'Junior';
  else if (text.includes('intern') || text.includes('trainee') || text.includes('prácticas')) experienceRequired = 'Intern';

  return {
    technologies: technologies.length > 0 ? technologies : ['JavaScript'],
    experienceRequired,
    workModality: isRemoteJob(title, description),
    companyType,
    englishLevel,
  };
}

module.exports = {
  searchJobs,
};
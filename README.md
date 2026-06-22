🔧 JobFinder — Backend API
JobFinder es una plataforma fullstack orientada a la búsqueda de empleo en el sector tech. Permite buscar ofertas con filtros avanzados, subir un CV en PDF y obtener un análisis de compatibilidad con cada oferta mediante IA generativa.
Este repositorio contiene la API REST que da soporte a toda la lógica de negocio: autenticación, gestión de ofertas, candidaturas y análisis de CV con OpenAI.
🚀 API en producción · 🌐 Ver frontend · 📦 Repo Frontend

📐 Arquitectura
Patrón Controllers → Repositories → Models con capa de servicios para integraciones externas.
src/
├── config/            # Conexión a MongoDB
├── controllers/       # Lógica de negocio
│   ├── authController.js
│   ├── userController.js
│   ├── jobController.js
│   ├── cvController.js
│   └── applicationController.js
├── models/            # Schemas Mongoose
│   ├── User.js
│   ├── Job.js
│   └── Application.js
├── repositories/      # Capa de acceso a datos
│   └── jobRepository.js
├── services/          # Servicios externos
│   └── cvAnalyzerService.js
├── routes/            # Definición de endpoints
├── middlewares/       # auth, checkRole, errorHandler
├── cron/              # Importación automática de ofertas
└── utils/             # distanceCalculator, helpers

🗄️ Modelos de Datos
User
CampoTipoDescripciónnameStringNombre del usuarioemailStringEmail únicopasswordStringHash bcryptjsroleStringUSER o ADMINcvTextStringTexto extraído del CV
Job
CampoTipoDescripcióntitleStringTítulo de la ofertacompanyNameStringEmpresadescriptionStringDescripción completalocationStringCiudadsalaryStringRango salarialmodalityStringRemote / Hybrid / On-sitesectorStringSector de la empresatechnologies[String]Stack técnicocoordinatesObjectlat, lng para geolocalizaciónviewsNumberContador de vistasapplicationsNumberContador de aplicaciones
Application
CampoTipoDescripciónuserObjectIdReferencia a UserjobObjectIdReferencia a JobstatusStringsaved / applied

🛣️ Endpoints API
Auth
MétodoRutaDescripciónPOST/api/auth/registerRegistro de usuarioPOST/api/auth/loginLogin (devuelve JWT)
Users
MétodoRutaAuthDescripciónGET/api/users/profile✅Obtener perfil propioPUT/api/users/profile✅Actualizar perfilPOST/api/users/cv✅Subir CV (PDF)GET/api/usersADMINListar todos los usuariosDELETE/api/users/:idADMINEliminar usuario
Jobs
MétodoRutaAuthDescripciónGET/api/jobs✅Listar ofertas (filtros + paginación)GET/api/jobs/:id✅Detalle de ofertaPOST/api/jobsADMINCrear ofertaPUT/api/jobs/:idADMINActualizar ofertaDELETE/api/jobs/:idADMINEliminar oferta
Query params para GET /api/jobs:

city — filtrar por ciudad
modality — Remote / Hybrid / On-site
salaryMin — salario mínimo
technologies — tecnologías separadas por coma
lat, lng, radius — geolocalización (km)
page, limit — paginación

Applications
MétodoRutaAuthDescripciónGET/api/applications✅Mis candidaturasPOST/api/applications✅Guardar/aplicar a ofertaDELETE/api/applications/:id✅Eliminar candidatura
CV Analysis (IA)
MétodoRutaAuthDescripciónPOST/api/cv/analyze✅Analizar CV subido (PDF)POST/api/cv/match/:jobId✅Comparar CV con oferta
Import
MétodoRutaAuthDescripciónPOST/api/import/adzunaADMINImportar ofertas de Adzuna

🔐 Seguridad

JWT con expiración configurable en middleware auth
bcryptjs para hash de contraseñas (salt rounds: 10)
checkRole middleware para rutas admin
express-validator para validación de datos de entrada
CORS configurado para dominios específicos (localhost + Vercel)
Protecciones admin: no se puede eliminar un usuario ADMIN ni a sí mismo
Variables de entorno en .env (incluido en .gitignore)


🚀 Instalación
Prerrequisitos

Node.js >= 20.x
npm >= 10.x
Cuenta en MongoDB Atlas
API Key de OpenAI

1. Clonar e instalar
bashgit clone https://github.com/BenitaPlata/jobfinder-backend.git
cd jobfinder-backend
npm install
2. Variables de entorno
Crear .env en la raíz:
envMONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster.mongodb.net/jobfinder
JWT_SECRET=tu_clave_secreta
PORT=3000
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXX
ADZUNA_APP_ID=tu-app-id       # Opcional
ADZUNA_API_KEY=tu-api-key     # Opcional
3. Iniciar
bash# Desarrollo
npm run dev

# Producción
npm start
Servidor en http://localhost:3000 · Healthcheck: GET / → { message: "✅ API JobFinder funcionando" }

🛠️ Stack
TecnologíaUsoNode.js 20+RuntimeExpress 4.21Framework HTTPMongoDB + MongooseBase de datosJWT + bcryptjsAutenticaciónOpenAI SDKAnálisis de CV con IApdf-parse v2Extracción de texto de PDFsMulterSubida de archivosnode-cronImportación automática diariaexpress-validatorValidación de datos

🔄 Cron Job
La importación de ofertas desde Adzuna se ejecuta automáticamente a las 3:00 AM cada día. También puede lanzarse manualmente con POST /api/import/adzuna (requiere rol ADMIN).

👩‍💻 Autora
Benita Plata · @BenitaPlata · Portfolio · LinkedIn

📄 Licencia
MIT License

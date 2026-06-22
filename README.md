# 🔧 JobFinder — Backend API

JobFinder es una plataforma fullstack orientada a la búsqueda de empleo en el sector tech. Permite buscar ofertas con filtros avanzados, subir un CV en PDF y obtener un análisis de compatibilidad con cada oferta mediante IA generativa.

Este repositorio contiene la API REST que da soporte a toda la lógica de negocio: autenticación, gestión de ofertas, candidaturas y análisis de CV con OpenAI.

🚀 **API en producción** · 🌐 **Frontend** · 📦 **Repositorio Frontend**

---

# 📐 Arquitectura

Patrón **Controllers → Repositories → Models** con capa de servicios para integraciones externas.

```text
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
```

---

# 🗄️ Modelos de Datos

## User

| Campo    | Tipo   | Descripción           |
| -------- | ------ | --------------------- |
| name     | String | Nombre del usuario    |
| email    | String | Email único           |
| password | String | Hash bcryptjs         |
| role     | String | USER o ADMIN          |
| cvText   | String | Texto extraído del CV |

## Job

| Campo        | Tipo     | Descripción                   |
| ------------ | -------- | ----------------------------- |
| title        | String   | Título de la oferta           |
| companyName  | String   | Empresa                       |
| description  | String   | Descripción completa          |
| location     | String   | Ciudad                        |
| salary       | String   | Rango salarial                |
| modality     | String   | Remote / Hybrid / On-site     |
| sector       | String   | Sector de la empresa          |
| technologies | String[] | Stack técnico                 |
| coordinates  | Object   | lat, lng para geolocalización |
| views        | Number   | Contador de vistas            |
| applications | Number   | Contador de aplicaciones      |

## Application

| Campo  | Tipo     | Descripción       |
| ------ | -------- | ----------------- |
| user   | ObjectId | Referencia a User |
| job    | ObjectId | Referencia a Job  |
| status | String   | saved / applied   |

---

# 🛣️ Endpoints API

## Auth

| Método | Ruta                 | Descripción          |
| ------ | -------------------- | -------------------- |
| POST   | `/api/auth/register` | Registro de usuario  |
| POST   | `/api/auth/login`    | Login (devuelve JWT) |

## Users

| Método | Ruta                 | Auth  | Descripción           |
| ------ | -------------------- | ----- | --------------------- |
| GET    | `/api/users/profile` | ✅     | Obtener perfil propio |
| PUT    | `/api/users/profile` | ✅     | Actualizar perfil     |
| POST   | `/api/users/cv`      | ✅     | Subir CV (PDF)        |
| GET    | `/api/users`         | ADMIN | Listar usuarios       |
| DELETE | `/api/users/:id`     | ADMIN | Eliminar usuario      |

## Jobs

| Método | Ruta            | Auth  | Descripción       |
| ------ | --------------- | ----- | ----------------- |
| GET    | `/api/jobs`     | ✅     | Listar ofertas    |
| GET    | `/api/jobs/:id` | ✅     | Detalle de oferta |
| POST   | `/api/jobs`     | ADMIN | Crear oferta      |
| PUT    | `/api/jobs/:id` | ADMIN | Actualizar oferta |
| DELETE | `/api/jobs/:id` | ADMIN | Eliminar oferta   |

### Query Params

```text
city           Filtrar por ciudad
modality       Remote / Hybrid / On-site
salaryMin      Salario mínimo
technologies   Tecnologías separadas por coma
lat, lng       Coordenadas
radius         Radio en kilómetros
page, limit    Paginación
```

## Applications

| Método | Ruta                    | Auth | Descripción              |
| ------ | ----------------------- | ---- | ------------------------ |
| GET    | `/api/applications`     | ✅    | Mis candidaturas         |
| POST   | `/api/applications`     | ✅    | Guardar/aplicar a oferta |
| DELETE | `/api/applications/:id` | ✅    | Eliminar candidatura     |

## CV Analysis (IA)

| Método | Ruta                   | Auth | Descripción            |
| ------ | ---------------------- | ---- | ---------------------- |
| POST   | `/api/cv/analyze`      | ✅    | Analizar CV subido     |
| POST   | `/api/cv/match/:jobId` | ✅    | Comparar CV con oferta |

## Import

| Método | Ruta                 | Auth  | Descripción                   |
| ------ | -------------------- | ----- | ----------------------------- |
| POST   | `/api/import/adzuna` | ADMIN | Importar ofertas desde Adzuna |

---

# 🔐 Seguridad

* JWT con expiración configurable.
* bcryptjs para hash de contraseñas.
* Middleware `checkRole` para rutas ADMIN.
* Validación de datos con `express-validator`.
* CORS configurado para localhost y Vercel.
* Protección contra eliminación de administradores.
* Variables sensibles almacenadas en `.env`.

---

# 🚀 Instalación

## Prerrequisitos

* Node.js >= 20.x
* npm >= 10.x
* MongoDB Atlas
* API Key de OpenAI

## 1. Clonar e instalar

```bash
git clone https://github.com/BenitaPlata/jobfinder-backend.git
cd jobfinder-backend
npm install
```

## 2. Variables de entorno

Crear un archivo `.env` en la raíz:

```env
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster.mongodb.net/jobfinder
JWT_SECRET=tu_clave_secreta
PORT=3000
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXX

ADZUNA_APP_ID=tu-app-id
ADZUNA_API_KEY=tu-api-key
```

## 3. Iniciar aplicación

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

Servidor disponible en:

```text
http://localhost:3000
```

Healthcheck:

```json
{
  "message": "✅ API JobFinder funcionando"
}
```

---

# 🛠️ Stack Tecnológico

| Tecnología         | Uso                     |
| ------------------ | ----------------------- |
| Node.js 20+        | Runtime                 |
| Express 4.21       | Framework HTTP          |
| MongoDB + Mongoose | Base de datos           |
| JWT + bcryptjs     | Autenticación           |
| OpenAI SDK         | Análisis de CV con IA   |
| pdf-parse          | Extracción de texto PDF |
| Multer             | Subida de archivos      |
| node-cron          | Tareas programadas      |
| express-validator  | Validación              |

---

# 🔄 Cron Job

La importación de ofertas desde Adzuna se ejecuta automáticamente cada día a las **03:00 AM**.

También puede lanzarse manualmente mediante:

```http
POST /api/import/adzuna
```

(Requiere rol ADMIN).

---

# 👩‍💻 Autora

**Benita Plata**

* GitHub: @BenitaPlata
* Portfolio
* LinkedIn

---

# 📄 Licencia

MIT License


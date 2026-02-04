🚀 JobFinder API — Backend

API RESTful para una plataforma fullstack de búsqueda de empleo multi-sector con autenticación, filtros avanzados y cálculo de distancia geográfica.

Este backend está diseñado para ser consumido por un frontend en React y desplegado en un entorno cloud (Railway / Render).

🌐 Estado del Despliegue

Backend (API): 🚧 Pendiente de despliegue

Se desplegará en Railway / Render

Base URL (producción):

https://<backend-url-aquí>


Frontend (cliente): React + Vite (Vercel)

⚠️ Mientras no esté desplegado, la API puede ejecutarse en local para desarrollo y testing.

🛠️ Tecnologías

Node.js v18+

Express v4

MongoDB Atlas + Mongoose

JWT para autenticación y roles

Bcrypt para hashing de contraseñas

Cloudinary para subida de CV

ESLint + Prettier para calidad de código

Jest + Supertest para testing básico

🧠 Arquitectura y Enfoque

Patrón Repository para acceso a datos

Separación clara de responsabilidades:

Controllers

Repositories

Middlewares

Routes

API escalable y desacoplada del frontend

Preparada para entorno production-ready

📁 Estructura del Proyecto
jobfinder-backend/
├── src/
│   ├── config/              # Configuración DB y Cloudinary
│   ├── models/              # Modelos Mongoose
│   ├── repositories/        # Acceso a datos (Repository Pattern)
│   ├── controllers/         # Lógica de negocio
│   ├── middlewares/         # Auth, roles, errores
│   ├── routes/              # Rutas de la API
│   ├── seeds/               # Seed de datos (CSV)
│   └── utils/               # Constantes y utilidades
├── tests/                   # Tests (Jest)
├── .gitignore
├── .eslintrc.cjs
├── .prettierrc.cjs
├── package.json
└── index.js                 # Punto de entrada

🔐 Variables de Entorno

En producción, estas variables se configuran directamente en el proveedor de despliegue
(Railway / Render).
En local, se usan mediante un archivo .env (NO versionado).

# Server
PORT=3000
NODE_ENV=production

# MongoDB Atlas
MONGODB_URI=your_mongodb_uri

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend (CORS)
FRONTEND_URL=https://<frontend-url>


⚠️ Nunca subir .env a GitHub.

🔌 Endpoints Principales
Autenticación (/api/auth)
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me        (auth)

Usuarios (/api/users)
GET    /api/users/profile        (auth)
PUT    /api/users/profile        (auth)
PUT    /api/users/cv             (auth)
DELETE /api/users/cv             (auth)
GET    /api/users                (admin)
DELETE /api/users/:id            (admin)

Ofertas de Trabajo (/api/jobs)
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs                 (admin)
PUT    /api/jobs/:id             (admin)
DELETE /api/jobs/:id             (admin)


Filtros disponibles:

sector

city

contractType

minSalary

technologies

experienceLevel

workModality

educationStage

centerType

schedule

userLat + userLng + maxDistance ⭐

Aplicaciones (/api/applications)
POST   /api/applications                  (auth)
GET    /api/applications/my-applications  (auth)
PUT    /api/applications/:id              (auth)
DELETE /api/applications/:id              (auth)
GET    /api/applications/all              (admin)

📍 Cálculo de Distancia Geográfica

Implementado con la fórmula de Haversine

Calcula distancia (km) entre usuario y oferta

Permite filtrar por distancia máxima

Las ofertas remote no se filtran por ubicación

👥 Roles del Sistema

user

Ver ofertas

Aplicar y guardar ofertas

Subir CV

admin

Todo lo anterior

CRUD de ofertas

Gestión de usuarios y aplicaciones

🧪 Testing
npm test


Incluye tests básicos de:

Autenticación

Endpoints protegidos

CRUD principal

🚀 Despliegue
Backend



👩‍💻 Autor

Benita Plata
Desarrolladora FullStack Junior
📧 itaplata.n@gmail.com

Proyecto realizado como parte del Máster en Desarrollo Web
📅 Febrero 2026

📄 Licencia

MIT License
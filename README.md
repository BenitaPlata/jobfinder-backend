# 🚀 JobFinder - Plataforma de Empleo Tecnológico

> Plataforma fullstack moderna para conectar talento tech con oportunidades laborales en España. Incluye análisis de CV con IA, filtros avanzados por geolocalización y diseño dark mode profesional.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai&logoColor=white)

---

## 🌐 Demo en Producción

- **Frontend (Vercel):** 👉 [jobfinder-frontend.vercel.app](https://jobfinder-frontend.vercel.app)
- **Backend API:** 👉 [jobfinder-api.railway.app](https://jobfinder-api.railway.app)

> ⚠️ URLs actualizadas tras despliegue definitivo

---

## 🎯 Sobre el Proyecto

**JobFinder** resuelve problemas reales del mercado laboral tech en España:

- ✅ Agrega **273+ ofertas tecnológicas** actualizadas diariamente mediante scraping automático
- ✅ **Análisis de CV con IA** (OpenAI GPT-4o-mini) + comparación inteligente con ofertas
- ✅ Filtros avanzados con **geolocalización real** (búsqueda por radio desde tu ubicación)
- ✅ Salarios transparentes y stack técnico detallado
- ✅ Diseño **dark mode profesional** con efectos neón

### Público Objetivo
Desarrolladores junior, mid y senior que buscan oportunidades tech de forma eficiente.

---

## ✨ Funcionalidades Principales

### 🔐 Autenticación y Perfiles
- Registro e inicio de sesión con JWT
- Roles: `user` y `admin`
- Rutas protegidas en frontend y backend
- Perfil personalizable con **CV integrado**

### 💼 Gestión de Ofertas
- **273+ ofertas tecnológicas** actualizadas automáticamente
- Scraping diario (cron 3:00 AM) desde API de Adzuna
- Vista detallada: stack técnico, salario, ubicación, modalidad
- Enlace directo a oferta original

### 🔍 Búsqueda Avanzada

**Filtros múltiples:**
- Ciudad, tipo de contrato, salario mínimo
- Modalidad (remoto/híbrido/presencial)
- Tecnologías específicas
- Tipo de empresa y nivel de inglés
- Solo ofertas con salario visible

**Geolocalización:**
- Búsqueda por radio (10-500km) desde ubicación actual
- Cálculo de distancia con fórmula Haversine
- Ofertas remotas siempre visibles
- Paginación: 10 ofertas por página

### 🤖 Análisis CV con IA (Funcionalidad Estrella)

#### Análisis Individual
Sube tu CV y obtén:
- Puntuación 0-100
- Compatibilidad ATS
- Fortalezas y debilidades
- Skills detectadas
- Keywords que faltan
- Recomendaciones específicas

#### Comparación CV-Oferta
- Guarda tu CV una vez en tu perfil
- Compara automáticamente con cualquier oferta
- Obtén % de compatibilidad en tiempo real
- Skills coincidentes vs. faltantes
- Recomendaciones personalizadas
- Riesgo ATS (bajo/medio/alto)

### 📊 Gestión de Candidaturas
- Guardar ofertas favoritas
- Marcar como "Inscrita"
- Dashboard organizado por estado
- Eliminar candidaturas

### 🎨 Diseño y UX
- **Dark mode profesional** con efectos neón
- **100% responsive** (móvil, tablet, desktop)
- **Animaciones fluidas** con Framer Motion
- **60+ badges flotantes animados** en hero
- **Iconografía moderna** con Lucide React
- **Paleta coherente** con variables CSS

---

## 🛠️ Stack Tecnológico

### Frontend
- **Core:** React 18.3, Vite 5.4
- **UI:** Chakra UI, Framer Motion, Lucide React
- **Routing:** React Router DOM 6.28
- **HTTP:** Axios
- **State:** Context API, Custom Hooks

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express 4.21
- **Database:** MongoDB + Mongoose
- **Auth:** JWT, Bcrypt
- **AI:** OpenAI API (GPT-4o-mini)
- **Files:** Multer, pdf-parse
- **Jobs:** node-cron
- **Scraping:** Adzuna API
- **Security:** CORS, express-validator

### Librerías Destacadas (No vistas en clase)
- **Framer Motion:** Animaciones avanzadas y fluidas
- **Lucide React:** Sistema de iconos moderno SVG
- **OpenAI SDK:** Integración con GPT-4o-mini
- **pdf-parse:** Extracción de texto de PDFs
- **node-cron:** Tareas programadas (scraping automático)

### Despliegue
- **Frontend:** Vercel
- **Backend:** Railway / Render
- **Base de datos:** MongoDB Atlas (cloud)

---

## 📐 Arquitectura

### Backend - Patrón MVC + Repository
```
backend/
├── src/
│   ├── config/          # Configuración DB
│   ├── controllers/     # Lógica de negocio
│   ├── models/          # Schemas Mongoose (User, Job, Application)
│   ├── routes/          # Endpoints API
│   ├── repositories/    # Capa de datos
│   ├── services/        # Servicios externos (IA, scraping)
│   ├── middlewares/     # Auth, validación, errores
│   ├── cron/            # Tareas programadas
│   └── utils/           # Constantes, helpers
└── index.js
```

### Frontend - Arquitectura por Capas
```
frontend/
├── src/
│   ├── api/             # Llamadas HTTP (Axios)
│   ├── components/      # Componentes reutilizables
│   │   ├── common/      # Navbar, Footer, Skeleton
│   │   └── jobs/        # JobCard, JobFilters
│   ├── context/         # AuthContext (state global)
│   ├── hooks/           # Custom hooks (useAuth, useJobs)
│   ├── pages/           # Vistas principales
│   ├── routes/          # Configuración rutas protegidas
│   ├── styles/          # CSS global + variables
│   └── theme.js         # Tema Chakra UI
└── App.jsx
```

---

## 🚀 Instalación Local

### Prerrequisitos
```bash
Node.js >= 20.x
npm >= 10.x
MongoDB Atlas account
OpenAI API key
```

### 1. Clonar repositorios

#### Backend
```bash
git clone https://github.com/BenitaPlata/jobfinder-backend.git
cd jobfinder-backend
npm install
```

#### Frontend
```bash
git clone https://github.com/BenitaPlata/jobfinder-frontend.git
cd jobfinder-frontend
npm install
```

### 2. Configurar variables de entorno

#### Backend (.env)
```bash
# MongoDB
MONGO_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster.mongodb.net/jobfinder

# JWT
JWT_SECRET=tu_clave_secreta

# Server
PORT=3000
FRONTEND_URL=http://localhost:5173

# OpenAI (para análisis CV)
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXX

# Adzuna API (scraping ofertas) - Opcional
ADZUNA_APP_ID=tu-app-id-aqui
ADZUNA_API_KEY=tu-api-key-aqui
```

**Cómo obtener las keys:**
- **MongoDB Atlas:** [Crear cluster gratuito](https://www.mongodb.com/cloud/atlas)
- **OpenAI API:** [Registrarse en OpenAI](https://platform.openai.com/signup)
- **Adzuna API:** [Solicitar keys](https://developer.adzuna.com/)

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3000/api
```


### 3. Iniciar aplicación

#### Terminal 1 - Backend
```bash
cd jobfinder-backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd jobfinder-frontend
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) 🎉

---

## 💡 Uso

### 1. Registro y Exploración
1. Regístrate con email
2. Explora 273+ ofertas tech
3. Usa filtros: ciudad, tecnologías, salario, modalidad
4. Filtra por distancia desde tu ubicación

### 2. Analizar CV
1. Navega a "Analizar CV"
2. Sube tu PDF
3. Obtén análisis completo con IA
4. Sigue recomendaciones

### 3. Guardar CV y Comparar
1. Ve a "Mi Perfil"
2. Sube tu CV definitivo
3. Entra en cualquier oferta
4. Click "🎯 Ver compatibilidad con mi CV"
5. Obtén % de match + skills faltantes

### 4. Gestionar Candidaturas
1. "Guardar oferta" → Favoritos
2. "Marcar como inscrita" → Seguimiento
3. Dashboard en "Mis Candidaturas"

---

## 🧠 Decisiones Técnicas Destacadas

### 1. Scraping Automático vs. Seed Estático

**Decisión:** Implementar scraping automático en lugar de seed desde Excel.

**Justificación:**
- ✅ **Datos reales:** 273+ ofertas vigentes de Adzuna API
- ✅ **Actualización diaria:** Cron job a las 3:00 AM
- ✅ **Escalable:** Sin intervención manual
- ✅ **Superior al requisito:** Más valor que 100 registros estáticos

### 2. Análisis CV con IA

**Decisión:** Integrar OpenAI GPT-4o-mini para análisis inteligente.

**Justificación:**
- ✅ **Diferenciador:** Funcionalidad única no vista en clase
- ✅ **Valor real:** Detecta skills, ATS compatibility, gaps
- ✅ **Innovación:** Ningún portal español tiene esto
- ✅ **Coste bajo:** ~$0.002 por análisis

### 3. Dark Mode + Neón

**Decisión:** Diseño dark mode con efectos neón.

**Paleta:**
```css
--color-primary: #C9ADE3;   /* Lila neón */
--color-secondary: #FFB3D9; /* Rosa neón */
--color-accent: #7FFFD4;    /* Aqua neón */
--bg-primary: #0a0a0f;      /* Negro profundo */
```

**Justificación:**
- ✅ Público tech prefiere interfaces oscuras
- ✅ Branding único y moderno
- ✅ Menos cansancio visual

---

## 📊 Rendimiento

- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3s
- **Bundle size:** ~250KB gzipped
- **Optimizaciones:** Lazy loading, paginación, code splitting

---

## 🔐 Seguridad

- JWT con expiración configurable
- Bcrypt para passwords (salt rounds: 10)
- Validación exhaustiva con express-validator
- CORS configurado para dominio específico
- Variables de entorno nunca en repositorio
- Rutas protegidas con middleware de autenticación

---

## 🗺️ Roadmap

### ✅ V1.0 (Actual)
- Autenticación JWT con roles
- 273+ ofertas actualizadas diariamente
- Análisis CV con IA
- Comparación CV-oferta
- Filtros avanzados + geolocalización
- Dark mode profesional

### 🔮 V2.0 (Futuro)
- [ ] Notificaciones push (ofertas match perfil)
- [ ] Chat en tiempo real (Socket.io)
- [ ] Calendario de entrevistas
- [ ] Panel para empresas (publicar ofertas)
- [ ] Sistema de valoraciones
- [ ] Integración LinkedIn
- [ ] Multiidioma (ES/EN)
- [ ] Modo claro/oscuro toggle

---

## 👩‍💻 Autora

**Benita Plata**  
Desarrolladora Web Fullstack Junior | Especialización en IA

- 🌐 Portfolio: [benitaplata.com](https://portfolio-benitaplata.vercel.app/)
- 💼 LinkedIn: [linkedin.com/in/benita-plata](https://www.linkedin.com/in/benita-plata/)
- 🐙 GitHub: [@BenitaPlata](https://github.com/BenitaPlata)
- 📧 Email: itaplata.n@gmail.com

---

## 📚 Formación

- **Máster en IA e Innovación** - Founderz (2026-2027)
- **Máster de Desarrollo Web** - ThePower-UCAM (2024-2026)
- **CFGS Desarrollo de Aplicaciones Web** ThePower - DAW (2024-2026)

---

## 📌 Buenas Prácticas

- ✅ Arquitectura desacoplada frontend/backend
- ✅ Código formateado con ESLint + Prettier
- ✅ Commits claros y descriptivos
- ✅ Variables de entorno seguras
- ✅ Manejo robusto de errores
- ✅ Validación en cliente y servidor
- ✅ Responsive design mobile-first
- ✅ Componentes reutilizables

---

## ⭐ Nota para Recruiters

Este proyecto simula un **entorno profesional real**:
- Arquitectura escalable y mantenible
- Integración con APIs externas (Adzuna, OpenAI)
- Scraping automatizado con cron jobs
- Análisis con IA de última generación
- Despliegue en producción (Vercel + Railway)
- Documentación completa

Es un proyecto **portfolio-ready** que demuestra capacidad para:
- Diseñar arquitecturas fullstack
- Integrar servicios de terceros
- Implementar funcionalidades complejas (IA, geolocalización)
- Trabajar con tecnologías modernas
- Desplegar aplicaciones en la nube

---

## 🙏 Agradecimientos

- **ThePower-UCAM** - Formación en desarrollo web
- **Founderz** - Formación en IA
- **Adzuna** - API de ofertas laborales
- **OpenAI** - Integración GPT para análisis CV
- **Comunidad Open Source**

---

## 📄 Licencia

MIT License - Proyecto Académico  
Creado como Proyecto Final del Máster de Desarrollo Web (UCAM) y CFGS DAW

---

## 📞 Contacto

¿Preguntas? ¿Sugerencias? ¿Colaboraciones?

📧 itaplata.n@gmail.com  
💼 [LinkedIn](https://www.linkedin.com/in/benita-plata/)  
🐙 [GitHub Issues](https://github.com/BenitaPlata/jobfinder-frontend/issues)

---


**Hecho con 💜 en España**  
*Proyecto Fullstack | React + Node.js + MongoDB + OpenAI | 2026*
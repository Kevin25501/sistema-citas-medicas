const fs = require('fs');
const path = require('path');

const readmePath = path.join(__dirname, 'README.md');
const readmeContent = `
# 🏥 Sistema de Gestión de Citas Médicas - Consultorio San Rafael

## 📋 Descripción del Proyecto
Aplicación web full-stack desarrollada para la gestión eficiente de citas médicas. Permite a los pacientes visualizar médicos disponibles, agendar citas y gestionar su historial, mientras que el personal administrativo puede gestionar los recursos del consultorio.

## 🛠️ Tecnologías Utilizadas
### Frontend
- **React.js** con Vite
- **Tailwind CSS** para estilos
- **Axios** para consumo de API
- **React Router** para navegación

### Backend
- **Python** con FastAPI
- **SQLAlchemy** (ORM)
- **PostgreSQL** (Base de datos)
- **JWT** para autenticación segura

## 🏗️ Arquitectura
El sistema sigue una arquitectura **Cliente-Servidor** separando completamente el Frontend (React) del Backend (FastAPI), comunicándose mediante una API RESTful con tokens JWT.

## 📦 Requisitos del Sistema
- Node.js v18+
- Python 3.10+
- Base de datos PostgreSQL

## 🚀 Instalación y Ejecución

### Backend
1. Clonar el repositorio.
2. Instalar dependencias: \`pip install -r requirements.txt\`
3. Configurar variables de entorno (DATABASE_URL, SECRET_KEY).
4. Ejecutar: \`uvicorn app.main:app --reload\`

### Frontend
1. Entrar a la carpeta \`frontend-citas\`.
2. Instalar dependencias: \`npm install\`
3. Ejecutar: \`npm run dev\`

## 👥 Equipo de Desarrollo y Tareas
Kevin Alvarado

## 📄 Licencia
Material para uso académico exclusivo - Universidad Politécnica Salesiana (2026)
`;

fs.writeFileSync(readmePath, readmeContent);
console.log('✅ README.md generado exitosamente en la raíz del proyecto.');
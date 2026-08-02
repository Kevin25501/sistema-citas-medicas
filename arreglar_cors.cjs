const fs = require('fs');
const path = require('path');

console.log('🔧 Agregando configuración de CORS al backend...\n');

const mainPath = path.join(__dirname, 'app', 'main.py');
let mainContent = fs.readFileSync(mainPath, 'utf8');

// Verificar si ya existe CORS
if (mainContent.includes('CORSMiddleware')) {
    console.log('✅ CORS ya está configurado en main.py');
} else {
    // Agregar import de CORS al inicio
    const corsImport = 'from fastapi.middleware.cors import CORSMiddleware\n';
    if (!mainContent.includes(corsImport.trim())) {
        mainContent = corsImport + mainContent;
    }
    
    // Agregar configuración de CORS después de app = FastAPI()
    const corsConfig = `
# Configurar CORS para permitir conexiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
`;
    
    // Buscar donde está app = FastAPI()
    if (mainContent.includes('app = FastAPI(')) {
        mainContent = mainContent.replace(
            /app = FastAPI\([^)]*\)\n/,
            `app = FastAPI(
    title="Sistema de Citas Médicas",
    description="API para gestión de citas médicas - Consultorio San Rafael",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
`
        );
        console.log('✅ Configuración de CORS agregada a main.py');
    } else {
        // Si no encuentra app = FastAPI(), agregar al final de los imports
        mainContent += `\n${corsConfig}`;
        console.log('️  Configuración de CORS agregada al final del archivo');
    }
    
    fs.writeFileSync(mainPath, mainContent);
    console.log('✅ app/main.py actualizado con CORS');
}

console.log('\n📋 PRÓXIMOS PASOS:');
console.log('1. Reinicia Uvicorn (Ctrl+C y vuelve a ejecutar python -m uvicorn app.main:app --reload)');
console.log('2. Recarga el frontend (F5)');
console.log('3. Intenta agendar una cita nuevamente');
console.log('4. ¡Debería funcionar sin errores de CORS!');
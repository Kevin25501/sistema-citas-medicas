const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log(' INICIANDO ANÁLISIS COMPLETO DEL PROYECTO...\n');

const results = {
    backend: { exists: false, files: [], errors: [] },
    frontend: { exists: false, files: [], errors: [] },
    citas: { endpoint: false, model: false, controller: false, errors: [] },
    connection: { api: false, auth: false, errors: [] }
};

// ============================================
// 1. ANALIZAR BACKEND
// ============================================
console.log('📊 ANALIZANDO BACKEND...\n');

const backendPath = path.join(__dirname, 'app');
if (fs.existsSync(backendPath)) {
    results.backend.exists = true;
    
    // Buscar archivos importantes
    const filesToCheck = [
        'main.py',
        'models/usuario.py',
        'models/medico.py',
        'controllers/usuario_controller.py',
        'services/usuario_service.py',
        'repositories/usuario_repository.py'
    ];
    
    filesToCheck.forEach(file => {
        const fullPath = path.join(backendPath, file);
        if (fs.existsSync(fullPath)) {
            results.backend.files.push(file);
            console.log(`✅ ${file}`);
        } else {
            results.backend.errors.push(`❌ FALTA: ${file}`);
            console.log(`❌ FALTA: ${file}`);
        }
    });
    
    // VERIFICAR SI EXISTE EL MODELO CITA
    const citaModelPath = path.join(backendPath, 'models', 'cita.py');
    if (fs.existsSync(citaModelPath)) {
        results.citas.model = true;
        console.log('✅ Modelo Cita existe');
    } else {
        results.citas.errors.push('❌ NO EXISTE: app/models/cita.py');
        console.log('❌ NO EXISTE: app/models/cita.py');
    }
    
    // VERIFICAR SI EXISTE EL CONTROLADOR DE CITAS
    const citaControllerPath = path.join(backendPath, 'controllers', 'cita_controller.py');
    if (fs.existsSync(citaControllerPath)) {
        results.citas.controller = true;
        console.log('✅ Controller de Citas existe');
    } else {
        results.citas.errors.push('❌ NO EXISTE: app/controllers/cita_controller.py');
        console.log('❌ NO EXISTE: app/controllers/cita_controller.py');
    }
    
    // BUSCAR ENDPOINTS DE CITAS EN main.py
    try {
        const mainContent = fs.readFileSync(path.join(backendPath, 'main.py'), 'utf8');
        if (mainContent.includes('/api/citas') || mainContent.includes('cita_router')) {
            results.citas.endpoint = true;
            console.log('✅ Endpoint /api/citas registrado en main.py');
        } else {
            results.citas.errors.push('❌ Endpoint /api/citas NO está registrado en main.py');
            console.log('❌ Endpoint /api/citas NO está registrado en main.py');
        }
    } catch (e) {
        results.citas.errors.push('❌ Error al leer main.py');
    }
} else {
    results.backend.errors.push('❌ NO EXISTE: carpeta app/');
    console.log('❌ NO EXISTE: carpeta app/');
}

console.log('\n' + '='.repeat(50) + '\n');

// ============================================
// 2. ANALIZAR FRONTEND
// ============================================
console.log('📊 ANALIZANDO FRONTEND...\n');

const frontendPath = path.join(__dirname, 'frontend-citas', 'src');
if (fs.existsSync(frontendPath)) {
    results.frontend.exists = true;
    
    const frontendFiles = [
        'pages/AgendarCita.jsx',
        'pages/MisCitas.jsx',
        'pages/Dashboard.jsx',
        'pages/Login.jsx',
        'services/api.js',
        'App.jsx'
    ];
    
    frontendFiles.forEach(file => {
        const fullPath = path.join(frontendPath, file);
        if (fs.existsSync(fullPath)) {
            results.frontend.files.push(file);
            console.log(`✅ ${file}`);
            
            // Verificar contenido de api.js
            if (file === 'services/api.js') {
                const apiContent = fs.readFileSync(fullPath, 'utf8');
                if (apiContent.includes('crearCita')) {
                    console.log('   ✅ Función crearCita() existe');
                } else {
                    console.log('   ❌ Función crearCita() NO existe');
                    results.connection.errors.push('❌ api.js no tiene función crearCita()');
                }
                
                if (apiContent.includes('getMisCitas')) {
                    console.log('   ✅ Función getMisCitas() existe');
                } else {
                    console.log('   ❌ Función getMisCitas() NO existe');
                    results.connection.errors.push('❌ api.js no tiene función getMisCitas()');
                }
            }
        } else {
            results.frontend.errors.push(`❌ FALTA: ${file}`);
            console.log(`❌ FALTA: ${file}`);
        }
    });
} else {
    results.frontend.errors.push('❌ NO EXISTE: carpeta frontend-citas/src/');
    console.log(' NO EXISTE: carpeta frontend-citas/src/');
}

console.log('\n' + '='.repeat(50) + '\n');

// ============================================
// 3. VERIFICAR CONEXIÓN API
// ============================================
console.log('🔌 VERIFICANDO CONEXIÓN CON BACKEND...\n');

const apiPath = path.join(frontendPath, 'services', 'api.js');
if (fs.existsSync(apiPath)) {
    const apiContent = fs.readFileSync(apiPath, 'utf8');
    
    // Buscar URL base
    const urlMatch = apiContent.match(/API_BASE_URL\s*=\s*['"]([^'"]+)['"]/);
    if (urlMatch) {
        console.log(` URL Base: ${urlMatch[1]}`);
        results.connection.api = true;
        
        if (urlMatch[1].includes('localhost')) {
            console.log('⚠️  ADVERTENCIA: Apuntando a localhost (asegúrate de tener uvicorn corriendo)');
        } else if (urlMatch[1].includes('render.com')) {
            console.log('✅ Apuntando a Render (producción)');
        }
    } else {
        console.log('❌ No se encontró API_BASE_URL');
        results.connection.errors.push('❌ No hay API_BASE_URL definida');
    }
    
    // Verificar token JWT
    if (apiContent.includes('Authorization') || apiContent.includes('token')) {
        console.log('✅ Autenticación JWT configurada');
        results.connection.auth = true;
    } else {
        console.log('⚠️  No se encontró configuración de JWT');
    }
}

console.log('\n' + '='.repeat(50) + '\n');

// ============================================
// 4. DETECTAR ERRORES ESPECÍFICOS DE AGENDAR CITA
// ============================================
console.log('🎯 ANALIZANDO ERROR DE "AGENDAR CITA"...\n');

const agendarPath = path.join(frontendPath, 'pages', 'AgendarCita.jsx');
if (fs.existsSync(agendarPath)) {
    const agendarContent = fs.readFileSync(agendarPath, 'utf8');
    
    // Verificar si usa el endpoint correcto
    if (agendarContent.includes("api.post('/api/citas'")) {
        console.log('✅ AgendarCita.jsx usa endpoint: POST /api/citas');
    } else {
        console.log('❌ AgendarCita.jsx NO está llamando al endpoint correcto');
    }
    
    // Verificar si maneja errores
    if (agendarContent.includes('catch')) {
        console.log('✅ AgendarCita.jsx tiene manejo de errores');
    } else {
        console.log('⚠️  AgendarCita.jsx NO tiene manejo de errores try/catch');
    }
}

console.log('\n' + '='.repeat(50) + '\n');

// ============================================
// 5. RESUMEN FINAL
// ============================================
console.log('📋 RESUMEN DEL ANÁLISIS:\n');

const totalErrors = [
    ...results.backend.errors,
    ...results.frontend.errors,
    ...results.citas.errors,
    ...results.connection.errors
];

if (totalErrors.length === 0) {
    console.log('✅ ¡TODO ESTÁ CORRECTO! No se encontraron errores críticos.');
    console.log('\n🎯 PRÓXIMOS PASOS:');
    console.log('1. Asegúrate de tener uvicorn corriendo: python -m uvicorn app.main:app --reload');
    console.log('2. Verifica que el backend de Render esté activo');
    console.log('3. Prueba agendar una cita nuevamente');
} else {
    console.log(` SE ENCONTRARON ${totalErrors.length} ERRORES:\n`);
    totalErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
    });
    
    console.log('\n🔧 SOLUCIÓN RECOMENDADA:');
    if (!results.citas.model || !results.citas.controller || !results.citas.endpoint) {
        console.log('\n️  FALTA EL MÓDULO DE CITAS EN EL BACKEND');
        console.log('Necesitas crear:');
        console.log('1. app/models/cita.py (modelo de Cita)');
        console.log('2. app/controllers/cita_controller.py (endpoints)');
        console.log('3. app/services/cita_service.py (lógica de negocio)');
        console.log('4. app/repositories/cita_repository.py (acceso a BD)');
        console.log('5. Registrar el router en app/main.py');
    }
}

console.log('\n' + '='.repeat(50));
console.log('📄 Guardando reporte en: analisis_completo.txt\n');

// Guardar reporte
const reportPath = path.join(__dirname, 'analisis_completo.txt');
let report = `REPORTE DE ANÁLISIS - ${new Date().toLocaleString()}\n\n`;
report += `BACKEND: ${results.backend.exists ? '✅' : '❌'}\n`;
results.backend.files.forEach(f => report += `  ✅ ${f}\n`);
results.backend.errors.forEach(e => report += `  ${e}\n`);

report += `\nFRONTEND: ${results.frontend.exists ? '✅' : '❌'}\n`;
results.frontend.files.forEach(f => report += `  ✅ ${f}\n`);
results.frontend.errors.forEach(e => report += `  ${e}\n`);

report += `\nCITAS MODULE: ${results.citas.model && results.citas.controller && results.citas.endpoint ? '✅' : '❌'}\n`;
results.citas.errors.forEach(e => report += `  ${e}\n`);

report += `\nCONEXIÓN: ${results.connection.api ? '✅' : '❌'}\n`;
results.connection.errors.forEach(e => report += `  ${e}\n`);

report += `\n\nTOTAL ERRORES: ${totalErrors.length}\n`;
if (totalErrors.length > 0) {
    report += '\nERRORES DETALLADOS:\n';
    totalErrors.forEach(e => report += `  - ${e}\n`);
}

fs.writeFileSync(reportPath, report);
console.log('✅ Reporte guardado en: analisis_completo.txt');
console.log('\n ANÁLISIS COMPLETADO');
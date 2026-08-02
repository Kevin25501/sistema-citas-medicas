const fs = require('fs');
const path = require('path');

console.log(' INICIANDO DIAGNÓSTICO COMPLETO DEL SISTEMA DE CITAS...\n');

const report = [];

// ============================================
// 1. BUSCAR EL SCHEMA DE CITAS EN EL BACKEND
// ============================================
console.log('📋 1. Buscando schema de citas en el backend...\n');

const backendPath = path.join(__dirname, '..', 'app');
const schemasPath = path.join(backendPath, 'schemas');

if (fs.existsSync(schemasPath)) {
    const files = fs.readdirSync(schemasPath);
    const citaSchemaFile = files.find(f => f.includes('cita'));
    
    if (citaSchemaFile) {
        const schemaContent = fs.readFileSync(path.join(schemasPath, citaSchemaFile), 'utf8');
        console.log(`✅ Encontrado: ${citaSchemaFile}`);
        console.log('Contenido del schema:');
        console.log('─'.repeat(50));
        console.log(schemaContent);
        console.log('─'.repeat(50));
        
        // Extraer campos requeridos
        const classMatch = schemaContent.match(/class\s+\w+Create.*?:\s*([\s\S]*?)(?=\n\nclass|\n\ndef|\Z)/);
        if (classMatch) {
            const fields = classMatch[1].match(/(\w+)\s*:\s*\w+/g) || [];
            report.push('\n📋 CAMPOS QUE ESPERA EL BACKEND:');
            fields.forEach(f => report.push(`   - ${f.trim()}`));
        }
    } else {
        console.log('❌ No se encontró schema de citas');
        report.push('\n❌ BACKEND: No se encontró schema de citas');
    }
} else {
    console.log('❌ No se encontró carpeta schemas en el backend');
    report.push('\n❌ BACKEND: Carpeta schemas no encontrada');
}

// ============================================
// 2. VERIFICAR QUÉ ENVÍA EL FRONTEND
// ============================================
console.log('\n 2. Verificando qué envía el frontend...\n');

const agendarPath = path.join(__dirname, 'src', 'pages', 'AgendarCita.jsx');
if (fs.existsSync(agendarPath)) {
    const agendarContent = fs.readFileSync(agendarPath, 'utf8');
    
    // Buscar el handleSubmit
    const submitMatch = agendarContent.match(/await crearCita\(\{([\s\S]*?)\}\)/);
    if (submitMatch) {
        const fieldsSent = submitMatch[1].match(/(\w+):/g) || [];
        console.log('✅ Campos que envía el frontend:');
        fieldsSent.forEach(f => console.log(`   - ${f.replace(':', '')}`));
        report.push('\n CAMPOS QUE ENVÍA EL FRONTEND:');
        fieldsSent.forEach(f => report.push(`   - ${f.replace(':', '')}`));
    } else {
        console.log('❌ No se encontró la llamada a crearCita');
    }
}

// ============================================
// 3. VERIFICAR TOKEN JWT
// ============================================
console.log('\n🔐 3. Verificando configuración de JWT...\n');

const apiPath = path.join(__dirname, 'src', 'services', 'api.js');
if (fs.existsSync(apiPath)) {
    const apiContent = fs.readFileSync(apiPath, 'utf8');
    
    if (apiContent.includes('Authorization') || apiContent.includes('token')) {
        console.log('✅ El frontend tiene configuración de JWT');
        
        // Verificar si hay interceptor
        if (apiContent.includes('interceptors') || apiContent.includes('request')) {
            console.log('✅ Hay interceptors configurados');
        } else {
            console.log('⚠️  No se encontraron interceptors explícitos');
        }
    } else {
        console.log('❌ No se encontró configuración de JWT en api.js');
    }
}

// ============================================
// 4. RECOMENDACIONES
// ============================================
console.log('\n 4. GENERANDO RECOMENDACIONES...\n');

console.log('═'.repeat(60));
console.log('📊 RESUMEN DEL DIAGNÓSTICO:');
console.log('═'.repeat(60));

report.forEach(line => console.log(line));

console.log('\n🎯 ACCIÓN RECOMENDADA:');
console.log('1. Abre la consola del navegador (F12)');
console.log('2. Ve a la pestaña "Network" (Red)');
console.log('3. Intenta agendar una cita');
console.log('4. Busca la petición POST a /api/citas');
console.log('5. Haz clic en ella y revisa:');
console.log('   - Pestaña "Headers": Verifica el Authorization');
console.log('   - Pestaña "Payload": Verifica qué campos se enviaron');
console.log('6. Compara con lo que espera el backend (arriba)');

console.log('\n💾 Guardando reporte en: diagnostico_citas.txt\n');

const reportPath = path.join(__dirname, 'diagnostico_citas.txt');
fs.writeFileSync(reportPath, report.join('\n'));
console.log('✅ Reporte guardado');
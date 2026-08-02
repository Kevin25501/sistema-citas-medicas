const fs = require('fs');
const path = require('path');

console.log('🔧 CORREGIENDO ERRORES DE AGENDAMIENTO DE CITAS...\n');

// ============================================
// ERROR 1: Agregar función getMisCitas() a api.js
// ============================================
const apiPath = path.join(__dirname, 'src', 'services', 'api.js');
let apiContent = fs.readFileSync(apiPath, 'utf8');

if (!apiContent.includes('getMisCitas')) {
    apiContent += `

export const getMisCitas = async () => {
  const response = await api.get('/api/citas');
  return response.data;
};`;
    
    fs.writeFileSync(apiPath, apiContent);
    console.log('✅ AGREGADA: Función getMisCitas() en api.js');
} else {
    console.log('✅ Ya existe: Función getMisCitas() en api.js');
}

// ============================================
// ERROR 2: Corregir endpoint en AgendarCita.jsx
// ============================================
const agendarPath = path.join(__dirname, 'src', 'pages', 'AgendarCita.jsx');
let agendarContent = fs.readFileSync(agendarPath, 'utf8');

// Verificar si está usando el endpoint correcto
if (!agendarContent.includes("api.post('/api/citas'")) {
    // Reemplazar cualquier llamada incorrecta
    agendarContent = agendarContent.replace(
        /await crearCita\(\{[^}]+\}\)/,
        `await crearCita({ medico_id: Number(medicoId), fecha, hora, motivo })`
    );
    
    fs.writeFileSync(agendarPath, agendarContent);
    console.log('✅ CORREGIDO: Endpoint en AgendarCita.jsx');
} else {
    console.log('✅ Ya está correcto: Endpoint en AgendarCita.jsx');
}

// ============================================
// VERIFICACIÓN ADICIONAL: Asegurar que api.js tenga crearCita
// ============================================
if (!apiContent.includes('crearCita')) {
    apiContent += `

export const crearCita = async (citaData) => {
  const response = await api.post('/api/citas', citaData);
  return response.data;
};`;
    
    fs.writeFileSync(apiPath, apiContent);
    console.log('✅ AGREGADA: Función crearCita() en api.js');
} else {
    console.log('✅ Ya existe: Función crearCita() en api.js');
}

console.log('\n ¡ERRORES CORREGIDOS!');
console.log('\n📋 PRÓXIMOS PASOS:');
console.log('1. Reinicia el frontend (Ctrl+C y npm run dev)');
console.log('2. Asegúrate de tener uvicorn corriendo en otra terminal');
console.log('3. Prueba agendar una cita nuevamente');
console.log('4. Si el backend de citas no existe en Render, usa localhost');
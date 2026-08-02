const fs = require('fs');
const path = require('path');

console.log('🔧 DEBUG: Preparando frontend para revelar el error exacto del 422...\n');

// 1. Actualizar AgendarCita.jsx para mostrar el detalle del error
const agendarPath = path.join(__dirname, 'src', 'pages', 'AgendarCita.jsx');
let agendarContent = fs.readFileSync(agendarPath, 'utf8');

// Reemplazar el mensaje de error genérico por uno detallado
agendarContent = agendarContent.replace(
    /setMensaje\('❌ Error al agendar la cita'\);/g,
    `const errorMsg = error.response?.data?.detail 
        ? (Array.isArray(error.response.data.detail) 
            ? error.response.data.detail.map(d => d.msg || d).join(' | ') 
            : JSON.stringify(error.response.data.detail))
        : error.message;
      setMensaje('❌ Error: ' + errorMsg);
      console.error("Detalle del error:", error.response?.data);`
);

fs.writeFileSync(agendarPath, agendarContent);
console.log('✅ AgendarCita.jsx ahora mostrará el motivo exacto del error.');

// 2. Asegurar que la llamada a la API use la barra final (como lo espera tu backend)
const apiPath = path.join(__dirname, 'src', 'services', 'api.js');
let apiContent = fs.readFileSync(apiPath, 'utf8');

if (apiContent.includes("api.post('/api/citas',")) {
    apiContent = apiContent.replace("api.post('/api/citas',", "api.post('/api/citas/',");
    fs.writeFileSync(apiPath, apiContent);
    console.log('✅ api.js actualizado para usar /api/citas/ (POST)');
}

if (apiContent.includes("api.get('/api/citas')")) {
    apiContent = apiContent.replace("api.get('/api/citas')", "api.get('/api/citas/')");
    fs.writeFileSync(apiPath, apiContent);
    console.log('✅ api.js actualizado para usar /api/citas/ (GET)');
}

console.log('\n📋 PRÓXIMOS PASOS:');
console.log('1. Recarga la página en tu navegador (F5).');
console.log('2. Intenta agendar una cita de nuevo.');
console.log('3. El mensaje en rojo te dirá EXACTAMENTE qué campo está fallando (ej: "field required", "not a valid integer").');
console.log('4. ¡Copia y pega ese mensaje de error aquí! Con eso arreglo el payload en 1 minuto.');
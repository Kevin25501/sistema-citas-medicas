const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigiendo: cambiando usuario_id por paciente_id...\n');

const agendarPath = path.join(__dirname, 'src', 'pages', 'AgendarCita.jsx');
let agendarContent = fs.readFileSync(agendarPath, 'utf8');

// Reemplazar usuario_id por paciente_id
agendarContent = agendarContent.replace(
    /usuario_id:\s*Number\(usuarioId\)/g,
    'paciente_id: Number(usuarioId)'
);

// También actualizar el console.log para claridad
agendarContent = agendarContent.replace(
    /console\.log\('Usuario ID extraído del token:', usuarioId\);/g,
    "console.log('Paciente ID (usuario logueado):', usuarioId);"
);

fs.writeFileSync(agendarPath, agendarContent);
console.log('✅ AgendarCita.jsx actualizado: ahora envía paciente_id en lugar de usuario_id');

console.log('\n📋 PRÓXIMOS PASOS:');
console.log('1. Recarga la página (F5)');
console.log('2. Inicia sesión de nuevo');
console.log('3. Intenta agendar una cita');
console.log('4. ¡Debería funcionar!');
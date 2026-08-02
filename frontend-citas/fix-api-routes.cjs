const fs = require('fs');
const path = require('path');

const apiFilePath = path.join(__dirname, 'src', 'services', 'api.js');

console.log('🔧 Corrigiendo rutas de la API...\n');

// Leer el archivo actual
let content = fs.readFileSync(apiFilePath, 'utf8');

// Definir los reemplazos de rutas
const replacements = [
  { old: "'/login'", new: "'/api/usuarios/login'" },
  { old: "'/medicos'", new: "'/api/medicos'" },
  { old: "'/citas'", new: "'/api/citas'" },
  { old: "'/pacientes'", new: "'/api/pacientes'" },
  { old: "'/registro'", new: "'/api/usuarios/registro'" },
];

// Aplicar cada reemplazo
replacements.forEach(({ old, new: newRoute }) => {
  if (content.includes(old)) {
    content = content.replace(new RegExp(old, 'g'), newRoute);
    console.log(`✅ ${old} → ${newRoute}`);
  } else {
    console.log(`⚠️  ${old} no encontrado (ya estaba correcto o no existe)`);
  }
});

// Guardar el archivo actualizado
fs.writeFileSync(apiFilePath, content, 'utf8');

console.log('\n🎉 ¡Rutas actualizadas correctamente!');
console.log('📄 Archivo modificado: src/services/api.js');
console.log('\n🚀 Ahora ejecuta: npm run dev');
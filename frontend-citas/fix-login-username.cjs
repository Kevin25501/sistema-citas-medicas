const fs = require('fs');
const path = require('path');

const loginPath = path.join(__dirname, 'src', 'pages', 'Login.jsx');
let content = fs.readFileSync(loginPath, 'utf8');

content = content.replace('type="email"', 'type="text"');
content = content.replace('>Correo Electrónico</label>', '>Usuario</label>');

fs.writeFileSync(loginPath, content);
console.log('✅ Login corregido: ahora usa "Usuario" (texto)');
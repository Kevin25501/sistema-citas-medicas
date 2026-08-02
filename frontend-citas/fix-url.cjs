const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, 'src', 'services', 'api.js');
let content = fs.readFileSync(apiPath, 'utf8');

// Cambiar la URL de Render a localhost
content = content.replace(
  "const API_BASE_URL = 'https://sistema-citas-medicas-k58b.onrender.com';",
  "const API_BASE_URL = 'http://localhost:8000';"
);

fs.writeFileSync(apiPath, content);
console.log('✅ Frontend actualizado para usar el backend local (localhost:8000)');
const fs = require('fs');
const path = require('path');

// 1. Arreglar api.js
const apiPath = path.join(__dirname, 'src', 'services', 'api.js');
let apiContent = fs.readFileSync(apiPath, 'utf8');
apiContent = apiContent.replace(
  "const response = await api.post('/api/usuarios/login', { username, password });",
  "const response = await api.post('/api/usuarios/login', { email, password });"
);
fs.writeFileSync(apiPath, apiContent);
console.log('✅ api.js actualizado: ahora envía "email" al backend');

// 2. Arreglar Login.jsx
const loginPath = path.join(__dirname, 'src', 'pages', 'Login.jsx');
let loginContent = fs.readFileSync(loginPath, 'utf8');

loginContent = loginContent.replace("const [username, setUsername] = useState('');", "const [email, setEmail] = useState('');");
loginContent = loginContent.replace("value={username}", "value={email}");
loginContent = loginContent.replace("onChange={(e) => setUsername(e.target.value)}", "onChange={(e) => setEmail(e.target.value)}");
loginContent = loginContent.replace("const data = await login(username, password);", "const data = await login(email, password);");
loginContent = loginContent.replace(">Usuario</label>", ">Correo Electrónico</label>");
loginContent = loginContent.replace('type="text"', 'type="email"');

fs.writeFileSync(loginPath, loginContent);
console.log('✅ Login.jsx actualizado: ahora pide Correo Electrónico');
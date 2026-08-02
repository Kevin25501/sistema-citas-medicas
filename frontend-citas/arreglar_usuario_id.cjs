const fs = require('fs');
const path = require('path');

console.log('🔧 Agregando usuario_id al agendamiento de citas...\n');

// Actualizar AgendarCita.jsx
const agendarPath = path.join(__dirname, 'src', 'pages', 'AgendarCita.jsx');
let agendarContent = fs.readFileSync(agendarPath, 'utf8');

// Reemplazar el handleSubmit para que incluya el usuario_id
const newSubmit = `  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token');
      
      // Decodificar el token para obtener el usuario_id (o username)
      // El token JWT típicamente tiene la estructura: header.payload.signature
      const payload = JSON.parse(atob(token.split('.')[1]));
      const usuarioId = payload.id || payload.sub; // Dependiendo de cómo lo guardaste
      
      console.log('Usuario ID extraído del token:', usuarioId);
      
      // Enviar la cita con el usuario_id
      await crearCita({ 
        medico_id: Number(medicoId), 
        fecha, 
        hora, 
        motivo,
        usuario_id: Number(usuarioId) // Agregar el ID del usuario
      });
      setMensaje('✅ Cita agendada exitosamente');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.detail 
        ? (Array.isArray(error.response.data.detail) 
            ? error.response.data.detail.map(d => d.msg || d).join(' | ') 
            : JSON.stringify(error.response.data.detail))
        : error.message;
      setMensaje('❌ Error: ' + errorMsg);
      console.error("Detalle del error:", error.response?.data);
    }
  };`;

agendarContent = agendarContent.replace(
  /const handleSubmit = async \(e\) => \{[\s\S]*?\n  \};/g,
  newSubmit
);

fs.writeFileSync(agendarPath, agendarContent);
console.log('✅ AgendarCita.jsx actualizado: ahora incluye usuario_id del token JWT');

console.log('\n📋 PRÓXIMOS PASOS:');
console.log('1. Recarga la página (F5)');
console.log('2. Inicia sesión de nuevo (para tener un token fresco)');
console.log('3. Intenta agendar una cita');
console.log('4. Si sigue fallando, revisa la consola del navegador (F12) para ver qué usuario_id se está enviando');
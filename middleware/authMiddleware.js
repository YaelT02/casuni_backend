const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  let token;

  // Priorizar el token del encabezado si está presente
  if (req.headers['authorization']) {
    token = req.headers['authorization'].split(' ')[1]; // Formato "Bearer <token>"
  } else if (req.body.token) {
    // Si no hay encabezado, buscar en el cuerpo (solo para POST)
    token = req.body.token;
  } else if (req.query.token) {
    // También puedes soportar token en los parámetros de consulta (opcional)
    token = req.query.token;
  }

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token
    req.user = decoded; // Guardar los datos del usuario decodificados
    next(); // Continuar al siguiente middleware
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ message: 'Token no válido', error });
  }
};

module.exports = authenticateToken;

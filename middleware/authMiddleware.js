const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  let token;

  if (req.headers['authorization']) {
    token = req.headers['authorization'].split(' ')[1]; 
  } else if (req.body.token) {
    
    token = req.body.token;
  } else if (req.query.token) {
    
    token = req.query.token;
  }

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token
    req.user = decoded; 
    next(); 
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ message: 'Token no válido', error });
  }
};

module.exports = authenticateToken;



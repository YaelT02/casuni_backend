const verifyRole = (role) => {
    return (req, res, next) => {
      const { user } = req;
      if (!user || user.role !== role) {
        return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
      }
      next();
    };
  };
  
  module.exports = verifyRole;
  
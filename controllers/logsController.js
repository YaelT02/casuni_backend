const pool = require('../db');

const getLogs = async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
  }

  try {
    const [rows] = await pool.query(`
      SELECT l.id, l.event_type, l.description, l.created_at,
             u.name, u.username, u.area
      FROM logs l
      INNER JOIN users u ON l.user_id = u.id
      ORDER BY l.created_at DESC;
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener la bitácora:', error);
    res.status(500).json({ message: 'Error al obtener la bitácora', error });
  }
};

module.exports = { getLogs };

const pool = require('../db');

const getLogs = async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
  }

  try {
    const [rows] = await pool.query(`
      SELECT l.id, l.event_type, l.description, l.created_at,
             u.name, u.username, u.area, s.session_id, s.ip,
             s.started_at,
             CONCAT_WS(',', s.country, s.region, s.city) AS location
      FROM logs l
      INNER JOIN users u ON l.user_id = u.id
      LEFT JOIN sessions s ON l.session_id = s.session_id
      ORDER BY l.created_at DESC;
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener la bitácora:', error);
    res.status(500).json({ message: 'Error al obtener la bitácora', error });
  }
};

module.exports = { getLogs };

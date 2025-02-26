// utils/logger.js
const pool = require('../db');

const logEvent = async (userId, eventType, description = '', session_id = null) => {
  try {
    await pool.query(
      'INSERT INTO logs (user_id, event_type, description, session_id) VALUES (?, ?, ?, ?)',
      [userId, eventType, description, session_id]
    );
  } catch (error) {
    console.error('Error al registrar en la bitácora:', error);
  }
};

module.exports = logEvent;
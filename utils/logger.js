// utils/logger.js
const pool = require('../db');

const logEvent = async (userId, eventType, description = '') => {
  try {
    await pool.query(
      'INSERT INTO logs (user_id, event_type, description) VALUES (?, ?, ?)',
      [userId, eventType, description]
    );
  } catch (error) {
    console.error('Error al registrar en la bitácora:', error);
  }
};

module.exports = logEvent;
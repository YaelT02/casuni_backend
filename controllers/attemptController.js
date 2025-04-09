// controllers/attemptController.js
const pool = require('../db');

const createAttempt = async (req, res) => {
  const { enrollmentId } = req.params;
  const { attempt_number, score, passed } = req.body;

  try {
    // Verificar que no exceda 5 intentos
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM attempts WHERE enrollment_id = ?', [enrollmentId]);
    if (rows[0].count >= 5) {
      return res.status(400).json({ message: 'Máximo de intentos alcanzado' });
    }

    await pool.query(
      'INSERT INTO attempts (enrollment_id, attempt_number, score, passed) VALUES (?, ?, ?, ?)',
      [enrollmentId, attempt_number, score, passed]
    );
    res.status(201).json({ message: 'Intento registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar intento:', error);
    res.status(500).json({ message: 'Error al registrar intento', error });
  }
};

const getAttempts = async (req, res) => {
  const { enrollmentId } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM attempts WHERE enrollment_id = ? ORDER BY attempt_number ASC', [enrollmentId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener intentos:', error);
    res.status(500).json({ message: 'Error al obtener intentos', error });
  }
};

module.exports = { createAttempt, getAttempts };

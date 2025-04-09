// controllers/courseController.js
const pool = require('../db');

const createCourse = async (req, res) => {
  const { title, description, level, estimated_duration } = req.body;
  const created_by = req.user.id; // Se asume que el usuario ya está autenticado y es admin

  try {
    await pool.query(
      'INSERT INTO trainings (title, description, level, estimated_duration, created_by) VALUES (?, ?, ?, ?, ?)',
      [title, description, level, estimated_duration, created_by]
    );
    res.status(201).json({ message: 'Curso creado exitosamente' });
  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({ message: 'Error al crear curso', error });
  }
};

const getCourses = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM trainings ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({ message: 'Error al obtener cursos', error });
  }
};

module.exports = { createCourse, getCourses };

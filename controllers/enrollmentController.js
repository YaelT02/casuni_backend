// controllers/enrollmentController.js
const pool = require('../db');

const enrollUser = async (req, res) => {
  const { userId, trainingId } = req.body;
  try {
    await pool.query(
      'INSERT INTO enrollments (user_id, training_id) VALUES (?, ?)',
      [userId, trainingId]
    );
    res.status(201).json({ message: 'Inscripción registrada exitosamente' });
  } catch (error) {
    console.error('Error al inscribir usuario:', error);
    res.status(500).json({ message: 'Error al inscribir usuario', error });
  }
};

const updateProgress = async (req, res) => {
  const { progress_percentage, status } = req.body;
  const enrollmentId = req.params.id; 
  try {
    await pool.query(
      'UPDATE enrollments SET progress_percentage = ?, status = ? WHERE id = ?',
      [progress_percentage, status, enrollmentId]
    );
    res.status(200).json({ message: 'Progreso actualizado' });
  } catch (error) {
    console.error('Error al actualizar progreso:', error);
    res.status(500).json({ message: 'Error al actualizar progreso', error });
  }
};

module.exports = { enrollUser, updateProgress };

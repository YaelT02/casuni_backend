const pool = require('../db');

// 1. Crear inscripción
const createEnrollment = async (req, res) => {
  const userId = req.user.id;
  const { training_id } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO enrollments (user_id, training_id)
       VALUES (?, ?)`,
      [userId, training_id]
    );
    res.status(201).json({ message: 'Inscripción creada', enrollmentId: result.insertId });
  } catch (err) {
    console.error('Error al inscribir:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Ya estás inscrito en este curso' });
    }
    res.status(500).json({ message: 'Error al crear la inscripción' });
  }
};

// 2. Listar mis inscripciones
const getMyEnrollments = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await pool.query(
      `SELECT e.id, e.training_id, t.title, e.enrolled_at, e.status, e.progress_percentage
       FROM enrollments e
       JOIN trainings t ON t.id = e.training_id
       WHERE e.user_id = ?
       ORDER BY e.enrolled_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al listar inscripciones:', err);
    res.status(500).json({ message: 'Error al obtener inscripciones' });
  }
};

// 3. Obtener detalle de una inscripción
const getEnrollmentById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const [[enrollment]] = await pool.query(
      `SELECT e.id, e.training_id, t.title, t.description, e.enrolled_at, e.status, e.progress_percentage
       FROM enrollments e
       JOIN trainings t ON t.id = e.training_id
       WHERE e.id = ? AND e.user_id = ?`,
      [id, userId]
    );
    if (!enrollment) return res.status(404).json({ message: 'Inscripción no encontrada' });
    res.json(enrollment);
  } catch (err) {
    console.error('Error al obtener inscripción:', err);
    res.status(500).json({ message: 'Error al obtener inscripción' });
  }
};

// 4. Actualizar progreso y/o estado
const updateEnrollment = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { progress_percentage, status } = req.body;

  try {
    // Only allow updating your own
    const [result] = await pool.query(
      `UPDATE enrollments
       SET progress_percentage = COALESCE(?, progress_percentage),
           status = COALESCE(?, status)
       WHERE id = ? AND user_id = ?`,
      [progress_percentage, status, id, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Inscripción no encontrada o no tienes permiso' });
    }
    res.json({ message: 'Inscripción actualizada' });
  } catch (err) {
    console.error('Error al actualizar inscripción:', err);
    res.status(500).json({ message: 'Error al actualizar inscripción' });
  }
};

module.exports = {
  createEnrollment,
  getMyEnrollments,
  getEnrollmentById,
  updateEnrollment
};

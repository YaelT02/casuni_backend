// controllers/courseController.js
const pool = require('../db');

const createCourse = async (req, res) => {
  const { title, description, level, estimated_duration, model_id } = req.body;
  const created_by = req.user.id; // Se asume que el usuario ya está autenticado y es admin

  try {
    const [result] = await pool.query(
      'INSERT INTO trainings (title, description, level, estimated_duration, created_by) VALUES (?, ?, ?, ?, ?)',
      [title, description, level, estimated_duration, created_by]
    );

    const trainingId = result.insertId;

    if (model_id) {
      await pool.query(
        'INSERT INTO model_trainings (model_id, training_id) VALUES (?, ?)',
        [model_id, trainingId]
      );
    }
    
    res.status(201).json({ 
      message: 'Curso creado exitosamente',
      trainingId, });
  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({ message: 'Error al crear curso', error });
  }
};

/*const getCourses = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM trainings ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({ message: 'Error al obtener cursos', error });
  }
};*/

const getCourses = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        t.id,
        t.title,
        t.description,
        t.level,
        t.estimated_duration,
        b.name AS brand,
        m.name AS model_name,
        (
          SELECT COUNT(*)
          FROM modules AS mo
          WHERE mo.training_id = t.id
        ) AS module_count
        FROM trainings AS t
        INNER JOIN model_trainings AS mt ON mt.training_id = t.id
        INNER JOIN models AS m ON m.id = mt.model_id
        INNER JOIN brands AS b ON b.id = m.brand_id
        ORDER BY t.created_at DESC;
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({ message: 'Error al obtener cursos', error });
  }
};

module.exports = { createCourse, getCourses };

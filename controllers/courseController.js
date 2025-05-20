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

const getCourseById = async (req, res) => {
  const courseId = req.params.id;

  const query = `
    SELECT
      t.id AS course_id,
      t.title,
      t.description,
      t.level,
      t.estimated_duration,
      b.name AS brand,
      m.name AS model_name,
      mo.id AS module_id,
      mo.title AS module_title,
      mo.description AS module_description,
      c.id AS content_id,
      c.type,
      c.url,
      c.order AS content_order
    FROM trainings t
    INNER JOIN model_trainings mt ON mt.training_id = t.id
    INNER JOIN models m ON m.id = mt.model_id
    INNER JOIN brands b ON b.id = m.brand_id
    LEFT JOIN modules mo ON mo.training_id = t.id
    LEFT JOIN contents c ON c.module_id = mo.id
    WHERE t.id = ?
    ORDER BY mo.order ASC, content_order ASC;
  `;

  try {
    const [rows] = await pool.query(query, [courseId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    const courseData = {
      id: rows[0].course_id,
      title: rows[0].title,
      description: rows[0].description,
      level: rows[0].level,
      estimated_duration: rows[0].estimated_duration,
      brand: rows[0].brand,
      model_name: rows[0].model_name,
      modules: [],
    };

    const moduleMap = {};

    rows.forEach(row => {
      if (row.module_id) {
        if (!moduleMap[row.module_id]) {
          moduleMap[row.module_id] = {
            id: row.module_id,
            title: row.module_title,
            description: row.module_description,
            contents: [],
          };
          courseData.modules.push(moduleMap[row.module_id]);
        }

        if (row.content_id) {
          moduleMap[row.module_id].contents.push({
            id: row.content_id,
            type: row.type,
            url: row.url,
            order: row.content_order,
          });
        }
      }
    });

    res.status(200).json(courseData);
  } catch (error) {
    console.error('Error al obtener detalles del curso:', error);
    res.status(500).json({ message: 'Error al obtener detalles del curso', error });
  }
};

module.exports = { createCourse, getCourses, getCourseById };

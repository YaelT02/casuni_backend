const pool = require('../db');

const createModule = async (req, res) => {
  const { trainingId } = req.params;
  const { title, description, order } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO modules (training_id, title, description, `order`) VALUES (?, ?, ?, ?)',
      [trainingId, title, description, order]
    );
    const moduleId = result.insertId;
    /*await pool.query(
      'INSERT INTO modules (training_id, title, description, `order`) VALUES (?, ?, ?, ?)',
      [trainingId, title, description, order]
    );*/
    res.status(201).json({ message: 'Módulo creado exitosamente', moduleId });
  } catch (error) {
    console.error('Error al crear módulo:', error);
    res.status(500).json({ message: 'Error al crear módulo', error });
  }
};

const getModulesByCourse = async (req, res) => {
  const { trainingId } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM modules WHERE training_id = ? ORDER BY `order` ASC', [trainingId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener módulos:', error);
    res.status(500).json({ message: 'Error al obtener módulos', error });
  }
};

module.exports = { createModule, getModulesByCourse };

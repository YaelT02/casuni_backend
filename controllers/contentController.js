// controllers/contentController.js
const pool = require('../db');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');

const uploadContent = async (req, res) => {
  const { moduleId } = req.params;
  const { title, type, order } = req.body;

  try {
    // Subir archivo a Cloudinary (asegúrate de configurar el resource_type según el tipo de contenido)
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw',
      folder: 'course_contents',
      use_filename: true,
      unique_filename: false,
      format: type === 'pdf' ? 'pdf' : undefined,  // Si es PDF, forzamos formato pdf
    });

    // Borrar archivo temporal
    fs.unlinkSync(req.file.path);

    // Guardar la URL y datos en la base de datos
    await pool.query(
      'INSERT INTO contents (module_id, type, url, title, `order`) VALUES (?, ?, ?, ?, ?)',
      [moduleId, type, result.secure_url, title, order]
    );

    res.status(201).json({ message: 'Contenido subido exitosamente', url: result.secure_url });
  } catch (error) {
    console.error('Error al subir contenido:', error);
    res.status(500).json({ message: 'Error al subir contenido', error });
  }
};

const getContentsByModule = async (req, res) => {
  const { moduleId } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM contents WHERE module_id = ? ORDER BY `order` ASC', [moduleId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener contenidos:', error);
    res.status(500).json({ message: 'Error al obtener contenidos', error });
  }
};

module.exports = { uploadContent, getContentsByModule };
